// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DonationdesciIDL from '../target/idl/donationdesci.json'
import type { Donationdesci } from '../target/types/donationdesci'

// Re-export the generated IDL and type
export { Donationdesci, DonationdesciIDL }

// The programId is imported from the program IDL.
export const DONATIONDESCI_PROGRAM_ID = new PublicKey(DonationdesciIDL.address)

// This is a helper function to get the Donationdesci Anchor program.
export function getDonationdesciProgram(provider: AnchorProvider) {
  return new Program(DonationdesciIDL as Donationdesci, provider)
}

// This is a helper function to get the program ID for the Donationdesci program depending on the cluster.
export function getDonationdesciProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Donationdesci program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return DONATIONDESCI_PROGRAM_ID
  }
}
