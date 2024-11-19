// components/donations/DonationCard.tsx
import { formatDistance } from "date-fns";
import { Twitter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Donation } from "./types";

interface DonationCardProps {
  donation: Donation;
  showDetails?: boolean;
}

export function DonationCard({
  donation,
  showDetails = false,
}: DonationCardProps) {
  const progress = (donation.claimedAmount / donation.totalAmount) * 100;
  const timeLeft = formatDistance(new Date(donation.startTime), new Date(), {
    addSuffix: true,
  });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{donation.donorName}</h3>
          {donation.donorTwitter && (
            <a
              href={`https://twitter.com/${donation.donorTwitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              <Twitter className="w-4 h-4 mr-1" />@{donation.donorTwitter}
            </a>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Amount/Interval</p>
            <p className="font-medium">{donation.intervalAmount} SOL</p>
          </div>
          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-medium">{donation.totalAmount} SOL</p>
          </div>
          <div>
            <p className="text-gray-500">Interval</p>
            <p className="font-medium">{donation.intervalSeconds}s</p>
          </div>
          <div>
            <p className="text-gray-500">USD Value</p>
            <p className="font-medium">${donation.usdValue.toLocaleString()}</p>
          </div>
        </div>

        {showDetails && (
          <>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Release Schedule</h4>
              <p className="text-sm text-gray-500">Next release: {timeLeft}</p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a
                  href={`https://explorer.solana.com/address/${donation.ownerPubkey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Explorer
                </a>
              </Button>

              {donation.status === "active" && (
                <Button size="sm" className="flex-1" asChil>
                  <a href={`/donations/${donation.id}/releases`}>
                    View Releases
                  </a>
                </Button>
              )}
            </div>
          </>
        )}

        <div className="text-xs text-gray-500">
          Created{" "}
          {formatDistance(new Date(donation.createdAt), new Date(), {
            addSuffix: true,
          })}
        </div>
      </CardContent>
    </Card>
  );
}
d;
