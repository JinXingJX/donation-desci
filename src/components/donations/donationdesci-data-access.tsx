'use client'

import {getDonationdesciProgram, getDonationdesciProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useDonationdesciProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getDonationdesciProgramId(cluster.network as Cluster), [cluster])
  const program = getDonationdesciProgram(provider)

  const accounts = useQuery({
    queryKey: ['donationdesci', 'all', { cluster }],
    queryFn: () => program.account.donationdesci.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['donationdesci', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ donationdesci: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useDonationdesciProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useDonationdesciProgram()

  const accountQuery = useQuery({
    queryKey: ['donationdesci', 'fetch', { cluster, account }],
    queryFn: () => program.account.donationdesci.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['donationdesci', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ donationdesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['donationdesci', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ donationdesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['donationdesci', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ donationdesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['donationdesci', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ donationdesci: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
