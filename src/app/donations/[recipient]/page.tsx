"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TwitterIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Donation {
  id: number;
  donorName: string;
  donorAvatar: string;
  twitterHandle: string;
  amount: number;
  usdValue: number;
  date: string;
  interval: number;
  totalAmount: number;
  recipient: string;
  recipientImage: string;
}

export default function DonationsList({
  params,
}: {
  params: { recipient: string };
}) {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the donations from an API
    // For this example, we'll use mock data
    const mockDonations: Donation[] = [
      // ... (use the same mock data as in the main component)
    ];

    setDonations(mockDonations.filter((d) => d.recipient === params.recipient));
  }, [params.recipient]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        Donations for {params.recipient}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donations.map((donation) => (
          <Card key={donation.id}>
            <div className="relative h-40">
              <Image
                src={donation.recipientImage}
                alt={donation.recipient}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                <Image
                  src={donation.donorAvatar}
                  alt={donation.donorName}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <div>
                  <p className="text-white font-semibold">
                    {donation.donorName}
                  </p>
                  <a
                    href={`https://twitter.com/${donation.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white hover:underline"
                  >
                    <TwitterIcon className="w-4 h-4 mr-1" />@
                    {donation.twitterHandle}
                  </a>
                </div>
              </div>
            </div>
            <CardContent className="pt-4">
              <p>
                <strong>Amount per Interval:</strong> {donation.amount} SOL
              </p>
              <p>
                <strong>Interval:</strong> {donation.interval} seconds
              </p>
              <p>
                <strong>Total Amount:</strong> {donation.totalAmount} SOL
              </p>
              <p>
                <strong>USD Value:</strong> ${donation.usdValue.toFixed(2)}
              </p>
              <p>
                <strong>Date:</strong> {donation.date}
              </p>
              <Link
                href={`/donations/${params.recipient}/${donation.id}`}
                className="text-primary hover:underline"
              >
                View details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
