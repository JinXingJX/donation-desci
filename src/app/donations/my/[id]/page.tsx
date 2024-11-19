"use client";

import { MyDonations } from "@/components/donations/MyDonations";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface DonationDetailsPageProps {
  params: {
    id: string;
  };
}

export default function DonationDetailsPage({
  params,
}: DonationDetailsPageProps) {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donation Details</h1>
        <WalletMultiButton />
      </header>

      <MyDonations donationId={params.id} />
    </div>
  );
}
