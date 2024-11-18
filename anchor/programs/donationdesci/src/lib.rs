#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod donationdesci {
    use super::*;

  pub fn close(_ctx: Context<CloseDonationdesci>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.donationdesci.count = ctx.accounts.donationdesci.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.donationdesci.count = ctx.accounts.donationdesci.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDonationdesci>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.donationdesci.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDonationdesci<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Donationdesci::INIT_SPACE,
  payer = payer
  )]
  pub donationdesci: Account<'info, Donationdesci>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDonationdesci<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub donationdesci: Account<'info, Donationdesci>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub donationdesci: Account<'info, Donationdesci>,
}

#[account]
#[derive(InitSpace)]
pub struct Donationdesci {
  count: u8,
}
