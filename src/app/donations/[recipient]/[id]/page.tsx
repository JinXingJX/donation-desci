"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter } from "lucide-react";
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

export default function DonationDetails({
  params,
}: {
  params: { recipient: string; id: string };
}) {
  const [donation, setDonation] = useState<Donation | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the donation from an API
    // For this example, we'll use mock data
    const mockDonation: Donation = {
      id: parseInt(params.id),
      donorName: "Alice Scientist",
      donorAvatar: "/placeholder.svg?height=100&width=100",
      twitterHandle: "alice_sci",
      amount: 10,
      usdValue: 2000,
      date: "2023-05-01",
      interval: 86400,
      totalAmount: 100,
      recipient: params.recipient,
      recipientImage: "/placeholder.svg?height=300&width=400",
    };

    setDonation(mockDonation);
  }, [params.recipient, params.id]);

  if (!donation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        href={`/donations/${params.recipient}`}
        className="text-primary hover:underline mb-4 block"
      >
        &larr; Back to all donations for {params.recipient}
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Image
              src={donation.donorAvatar}
              alt={donation.donorName}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{donation.donorName}</h2>
              <a
                href={`https://twitter.com/${donation.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                <Twitter className="w-4 h-4 mr-1" />@{donation.twitterHandle}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Recipient:</strong> {donation.recipient}
              </p>
              <p>
                <strong>Amount per Interval:</strong> {donation.amount} SOL
              </p>
              <p>
                <strong>Interval:</strong> {donation.interval} seconds
              </p>
              <p>
                <strong>Total Amount:</strong> {donation.totalAmount} SOL
              </p>
            </div>
            <div>
              <p>
                <strong>USD Value:</strong> ${donation.usdValue.toFixed(2)}
              </p>
              <p>
                <strong>Date:</strong> {donation.date}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
