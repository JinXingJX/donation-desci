import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Donationdesci} from '../target/types/donationdesci'

describe('donationdesci', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Donationdesci as Program<Donationdesci>

  const donationdesciKeypair = Keypair.generate()

  it('Initialize Donationdesci', async () => {
    await program.methods
      .initialize()
      .accounts({
        donationdesci: donationdesciKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([donationdesciKeypair])
      .rpc()

    const currentCount = await program.account.donationdesci.fetch(donationdesciKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Donationdesci', async () => {
    await program.methods.increment().accounts({ donationdesci: donationdesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donationdesci.fetch(donationdesciKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Donationdesci Again', async () => {
    await program.methods.increment().accounts({ donationdesci: donationdesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donationdesci.fetch(donationdesciKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Donationdesci', async () => {
    await program.methods.decrement().accounts({ donationdesci: donationdesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donationdesci.fetch(donationdesciKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set donationdesci value', async () => {
    await program.methods.set(42).accounts({ donationdesci: donationdesciKeypair.publicKey }).rpc()

    const currentCount = await program.account.donationdesci.fetch(donationdesciKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the donationdesci account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        donationdesci: donationdesciKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.donationdesci.fetchNullable(donationdesciKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
