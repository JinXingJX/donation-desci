#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked},
};

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod donation_program {
    use anchor_spl::token::{self, Transfer};

    use super::*;

    pub fn initialize_donation(
        ctx: Context<InitializeDonation>,
        total_amount: u64,
        interval_amount: u64,
        interval_seconds: i64,
        start_time: i64,
        gas_budget: u64,
        bump: u8,
        donor_info: DonorInfo,  // 新增捐赠人信息参数
    ) -> Result<()> {
        let donation_account = &mut ctx.accounts.donation_account;
        let clock = Clock::get()?;

        // 参数验证
        require!(total_amount > 0, DonationError::InvalidAmount);
        require!(interval_amount > 0, DonationError::InvalidAmount);
        require!(
            interval_amount <= total_amount,
            DonationError::InvalidAmount
        );
        require!(
            interval_seconds >= constants::MIN_INTERVAL_SECONDS
                && interval_seconds <= constants::MAX_INTERVAL_SECONDS,
            DonationError::InvalidInterval
        );
        require!(
            gas_budget >= constants::MIN_GAS_BUDGET,
            DonationError::InvalidGasBudget
        );
        require!(
            start_time >= clock.unix_timestamp,
            DonationError::InvalidStartTime
        );
        
        // 验证捐赠人信息
        require!(
            donor_info.name.len() <= constants::MAX_NAME_LENGTH,
            DonationError::InvalidDonorInfo
        );
        require!(
            donor_info.twitter_handle.len() <= constants::MAX_TWITTER_LENGTH,
            DonationError::InvalidDonorInfo
        );

        // 初始化捐赠账户
        donation_account.owner = ctx.accounts.owner.key();
        donation_account.mint = ctx.accounts.mint.key();
        donation_account.escrow = ctx.accounts.escrow_token.key();
        donation_account.recipient = ctx.accounts.recipient.key();
        donation_account.total_amount = total_amount;
        donation_account.interval_amount = interval_amount;
        donation_account.interval_seconds = interval_seconds;
        donation_account.start_time = start_time;
        donation_account.claimed_amount = 0;
        donation_account.last_release_time = start_time;
        donation_account.gas_budget = gas_budget;
        donation_account.gas_used = 0;
        donation_account.bump = bump;
        
        // 新增捐赠人信息
        donation_account.donor_info = donor_info.clone();
        donation_account.created_at = clock.unix_timestamp;
        donation_account.usd_value = calculate_usd_value(total_amount);

        // 转移捐赠代币到托管账户
        let transfer_instruction = Transfer {
            from: ctx.accounts.from_token.to_account_info(),
            to: ctx.accounts.escrow_token.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
            ),
            total_amount,
        )?;

        // 转移SOL作为gas预算
        let transfer_sol_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.gas_vault.to_account_info(),
        };

        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_sol_instruction,
            ),
            gas_budget,
        )?;

        emit!(DonationInitialized {
            donation_account: donation_account.key(),
            owner: ctx.accounts.owner.key(),
            recipient: ctx.accounts.recipient.key(),
            total_amount,
            interval_amount,
            interval_seconds,
            start_time,
            donor_name: donor_info.name.clone(),
            donor_twitter: donor_info.twitter_handle,
            usd_value: donation_account.usd_value,
        });

        Ok(())
    }


    pub fn release_donation(ctx: Context<ReleaseDonation>, gas_fee: u64) -> Result<()> {
        let clock = Clock::get()?;
    
        // 验证接收者token账户
        require!(
            ctx.accounts.recipient_token.owner == ctx.accounts.donation_account.recipient,
            DonationError::InvalidRecipient
        );
    
        // 检查是否已达到开始时间
        require!(
            clock.unix_timestamp >= ctx.accounts.donation_account.start_time,
            DonationError::NotStarted
        );
    
        // 检查时间间隔
        require!(
            clock.unix_timestamp
                >= ctx.accounts.donation_account.last_release_time + ctx.accounts.donation_account.interval_seconds,
            DonationError::TooEarly
        );
    
        // 检查gas预算
        let remaining_gas = ctx.accounts.donation_account
            .gas_budget
            .checked_sub(ctx.accounts.donation_account.gas_used)
            .ok_or(DonationError::InsufficientGas)?;
        require!(remaining_gas >= gas_fee, DonationError::InsufficientGas);
    
        // 计算本次释放金额
        let remaining_amount = ctx.accounts.donation_account
            .total_amount
            .checked_sub(ctx.accounts.donation_account.claimed_amount)
            .ok_or(DonationError::NoRemainingAmount)?;
        let release_amount = std::cmp::min(remaining_amount, ctx.accounts.donation_account.interval_amount);
    
        // 验证托管账户余额
        require!(
            ctx.accounts.escrow_token.amount >= release_amount,
            DonationError::InsufficientFunds
        );
    
        // 从托管账户转移代币到接收者
        let seeds = &[
            constants::DONATION_SEED_PREFIX,
            ctx.accounts.donation_account.owner.as_ref(),
            &[ctx.accounts.donation_account.bump],
        ];
        let signer = &[&seeds[..]];
    
        let transfer_instruction = Transfer {
            from: ctx.accounts.escrow_token.to_account_info(),
            to: ctx.accounts.recipient_token.to_account_info(),
            authority: ctx.accounts.donation_account.to_account_info(),
        };
    
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
                signer,
            ),
            release_amount,
        )?;
    
        // 支付gas费用给执行者
        let transfer_sol_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.gas_vault.to_account_info(),
            to: ctx.accounts.executor.to_account_info(),
        };
    
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_sol_instruction,
            ),
            gas_fee,
        )?;
    
        // 全部操作完成后，最后一次性更新状态
        let donation_account = &mut ctx.accounts.donation_account;
        donation_account.claimed_amount = donation_account
            .claimed_amount
            .checked_add(release_amount)
            .ok_or(DonationError::CalculationOverflow)?;
        donation_account.last_release_time = clock.unix_timestamp;
        donation_account.gas_used = donation_account
            .gas_used
            .checked_add(gas_fee)
            .ok_or(DonationError::CalculationOverflow)?;
    
        emit!(DonationReleased {
            donation_account: donation_account.key(),
            amount: release_amount,
            recipient: ctx.accounts.recipient_token.owner,
            timestamp: clock.unix_timestamp,
        });
    
        Ok(())
    }


    // 仅允许添加gas预算
    pub fn add_gas_budget(ctx: Context<AddGasBudget>, amount: u64) -> Result<()> {
        require!(amount > 0, DonationError::InvalidAmount);

        let donation_account = &mut ctx.accounts.donation_account;

        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.gas_vault.to_account_info(),
        };

        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;

        donation_account.gas_budget = donation_account
            .gas_budget
            .checked_add(amount)
            .ok_or(DonationError::CalculationOverflow)?;

        emit!(GasBudgetAdded {
            donation_account: donation_account.key(),
            amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeDonation<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: This is the token mint
    pub mint: UncheckedAccount<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<DonationAccount>(),
        seeds = [constants::DONATION_SEED_PREFIX, owner.key().as_ref()],
        bump,
    )]
    pub donation_account: Account<'info, DonationAccount>,

    #[account(
        init,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = donation_account,
    )]
    pub escrow_token: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = from_token.owner == owner.key(),
        constraint = from_token.mint == mint.key(),
    )]
    pub from_token: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: 接收者地址
    pub recipient: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK: Gas费用存储账户
    pub gas_vault: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReleaseDonation<'info> {
    pub executor: Signer<'info>,

    #[account(mut)]
    pub donation_account: Account<'info, DonationAccount>,

    #[account(
        mut,
        constraint = escrow_token.owner == donation_account.key(),
        constraint = escrow_token.mint == donation_account.mint,
    )]
    pub escrow_token: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = recipient_token.mint == donation_account.mint,
    )]
    pub recipient_token: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    /// CHECK: Gas费用存储账户
    pub gas_vault: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGasBudget<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = donation_account.owner == owner.key(),
    )]
    pub donation_account: Account<'info, DonationAccount>,

    #[account(mut)]
    /// CHECK: Gas费用存储账户
    pub gas_vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct DonationAccount {
    pub owner: Pubkey,          // 捐赠者地址
    pub mint: Pubkey,           // 代币地址
    pub escrow: Pubkey,         // 托管账户地址
    pub recipient: Pubkey,      // 接收者地址
    pub total_amount: u64,      // 总捐赠金额
    pub interval_amount: u64,   // 每次释放金额
    pub interval_seconds: i64,  // 释放间隔
    pub claimed_amount: u64,    // 已释放金额
    pub last_release_time: i64, // 上次释放时间
    pub start_time: i64,        // 开始时间
    pub gas_budget: u64,        // gas预算
    pub gas_used: u64,          // 已使用的gas
    pub bump: u8,               // PDA bump
    // 新增字段
    pub donor_info: DonorInfo,  // 捐赠人信息
    pub created_at: i64,        // 创建时间
    pub usd_value: u64,        // USD价值 (使用最小单位，例如 cents)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct DonorInfo {
    pub name: String,           // 捐赠人名称
    pub twitter_handle: String, // Twitter 账号
}

// 事件定义
#[event]
pub struct DonationReleased {
    pub donation_account: Pubkey,
    pub amount: u64,
    pub recipient: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct DonationInitialized {
    pub donation_account: Pubkey,
    pub owner: Pubkey,
    pub recipient: Pubkey,
    pub total_amount: u64,
    pub interval_amount: u64,
    pub interval_seconds: i64,
    pub start_time: i64,
    pub donor_name: String,
    pub donor_twitter: String,
    pub usd_value: u64,
}

#[event]
pub struct GasBudgetAdded {
    pub donation_account: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum DonationError {
    #[msg("Invalid donation amount")]
    InvalidAmount,

    #[msg("Invalid gas budget amount")]
    InvalidGasBudget,

    #[msg("Invalid release time interval")]
    InvalidInterval,

    #[msg("Invalid start time")]
    InvalidStartTime,

    #[msg("Donation has not started yet")]
    NotStarted,

    #[msg("Insufficient gas budget")]
    InsufficientGas,

    #[msg("Too early for next release")]
    TooEarly,

    #[msg("No remaining amount to release")]
    NoRemainingAmount,

    #[msg("Calculation overflow occurred")]
    CalculationOverflow,

    #[msg("Invalid recipient account")]
    InvalidRecipient,

    #[msg("Insufficient funds in escrow account")]
    InsufficientFunds,

    #[msg("Invalid donor information")]
    InvalidDonorInfo,
}

// Constants
pub mod constants {
    pub const DONATION_SEED_PREFIX: &[u8] = b"donation";
    pub const MIN_INTERVAL_SECONDS: i64 = 60; // 最小释放间隔1分钟
    pub const MAX_INTERVAL_SECONDS: i64 = 31536000; // 最大释放间隔1年
    pub const MIN_GAS_BUDGET: u64 = 1_000_000; // 最小gas预算0.001 SOL
    pub const MAX_NAME_LENGTH: usize = 50;
    pub const MAX_TWITTER_LENGTH: usize = 20;
}

// 辅助函数：计算USD价值 (这里使用一个模拟汇率)
fn calculate_usd_value(amount: u64) -> u64 {
    // 假设 1 SOL = $200 USD，并且我们使用 cents 作为最小单位
    amount.saturating_mul(20000)
}
