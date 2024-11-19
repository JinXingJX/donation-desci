// components/donations/DonationBlinks.tsx
import { useRouter } from "next/router";
import { useDonationProgram } from "./DonationProvider";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlinkOption {
  amount: number;
  interval: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BLINK_OPTIONS: BlinkOption[] = [
  {
    title: "Daily Support",
    description: "Small daily contributions add up!",
    amount: 0.1, // 0.1 SOL per day
    interval: 86400, // 24 hours in seconds
    icon: <ClockIcon className="w-6 h-6" />,
  },
  {
    title: "Weekly Boost",
    description: "Consistent weekly support",
    amount: 0.5, // 0.5 SOL per week
    interval: 604800, // 7 days in seconds
    icon: <CalendarIcon className="w-6 h-6" />,
  },
  {
    title: "Monthly Impact",
    description: "Make a significant monthly impact",
    amount: 2, // 2 SOL per month
    interval: 2592000, // 30 days in seconds
    icon: <TrendingUpIcon className="w-6 h-6" />,
  },
];

interface DonationBlinksProps {
  recipient: string;
  recipientName: string;
}

export function DonationBlinks({
  recipient,
  recipientName,
}: DonationBlinksProps) {
  const router = useRouter();
  const { program } = useDonationProgram();
  const wallet = useWallet();
  const [loading, setLoading] = useState<string | null>(null);

  const handleQuickDonate = async (option: BlinkOption) => {
    if (!wallet.connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to make a donation",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(option.title);

      const totalAmount = option.amount * 12; // 12 intervals
      const startTime = Math.floor(Date.now() / 1000); // Start immediately

      // Create donation on-chain
      const tx = await program.methods
        .initializeDonation({
          totalAmount: new anchor.BN(totalAmount * 1e9),
          intervalAmount: new anchor.BN(option.amount * 1e9),
          intervalSeconds: new anchor.BN(option.interval),
          startTime: new anchor.BN(startTime),
          donorInfo: {
            name: wallet.publicKey?.toString().slice(0, 8) || "Anonymous",
            twitterHandle: "",
          },
        })
        .accounts({
          owner: wallet.publicKey,
          recipient: new PublicKey(recipient),
          // ... other required accounts
        })
        .rpc();

      // Save to database
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionSignature: tx,
          ownerPubkey: wallet.publicKey?.toString(),
          recipientPubkey: recipient,
          totalAmount: totalAmount,
          intervalAmount: option.amount,
          intervalSeconds: option.interval,
          startTime: startTime,
        }),
      });

      if (!response.ok) throw new Error("Failed to save donation");

      const donation = await response.json();

      toast({
        title: "Donation Created!",
        description: `Successfully created ${option.title.toLowerCase()} donation`,
      });

      // Redirect to donation details page
      router.push(`/donations/my/${donation.id}`);
    } catch (error) {
      console.error("Donation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create donation",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quick Donate to {recipientName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BLINK_OPTIONS.map((option) => (
          <Card
            key={option.title}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              loading === option.title ? "opacity-50" : ""
            }`}
            onClick={() => handleQuickDonate(option)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                {option.icon}
                <CardTitle>{option.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                <div className="text-lg font-bold">
                  {option.amount} SOL /{" "}
                  {option.interval === 86400
                    ? "day"
                    : option.interval === 604800
                      ? "week"
                      : "month"}
                </div>
                <div className="text-sm text-muted-foreground">
                  = ${(option.amount * 200).toFixed(2)} USD
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
