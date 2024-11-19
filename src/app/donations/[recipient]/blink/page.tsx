"use client";

import { DonationBlinks } from "@/components/donations/DonationBlinks";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

interface BlinkPageProps {
  params: {
    recipient: string;
  };
}

export default function BlinkPage({ params }: BlinkPageProps) {
  const [recipientInfo, setRecipientInfo] = useState(null);

  useEffect(() => {
    // Fetch recipient info
    fetch(`/api/recipients/${params.recipient}`)
      .then((res) => res.json())
      .then(setRecipientInfo)
      .catch(console.error);
  }, [params.recipient]);

  if (!recipientInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quick Donate</h1>
        <WalletMultiButton />
      </header>

      <DonationBlinks
        recipient={params.recipient}
        recipientName={recipientInfo.name}
      />
    </div>
  );
}
