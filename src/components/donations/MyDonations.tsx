import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { DonationCard } from "./DonationCard";

interface MyDonationsProps {
  donationId?: string; // Optional specific donation ID
}

export function MyDonations({ donationId }: MyDonationsProps) {
  const wallet = useWallet();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet.connected) return;

    const fetchDonations = async () => {
      try {
        const params = new URLSearchParams({
          owner: wallet.publicKey?.toString() || "",
        });
        if (donationId) {
          params.append("id", donationId);
        }

        const response = await fetch(`/api/donations/my?${params}`);
        if (!response.ok) throw new Error("Failed to fetch donations");

        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [wallet.connected, wallet.publicKey, donationId]);

  if (!wallet.connected) {
    return (
      <div className="text-center py-8">
        <p>Please connect your wallet to view your donations</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {donationId ? "Donation Details" : "My Donations"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donations.map((donation) => (
          <DonationCard
            key={donation.id}
            donation={donation}
            showDetails={!!donationId}
          />
        ))}
      </div>
      {donations.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">
          No donations found
        </p>
      )}
    </div>
  );
}
