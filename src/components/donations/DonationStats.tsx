import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Donation } from "./types";

interface DonationStatsProps {
  donations: Donation[];
}

export function DonationStats({ donations }: DonationStatsProps) {
  const stats = useMemo(() => {
    return {
      totalAmount: donations.reduce((sum, d) => sum + d.totalAmount, 0),
      totalDonors: new Set(donations.map((d) => d.ownerPubkey)).size,
      averageAmount:
        donations.length > 0
          ? donations.reduce((sum, d) => sum + d.totalAmount, 0) /
            donations.length
          : 0,
      totalUsdValue: donations.reduce((sum, d) => sum + d.usdValue, 0),
    };
  }, [donations]);

  const chartData = useMemo(() => {
    const dailyData = donations.reduce(
      (acc, donation) => {
        const date = new Date(donation.createdAt).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, amount: 0, count: 0 };
        }
        acc[date].amount += donation.totalAmount;
        acc[date].count += 1;
        return acc;
      },
      {} as Record<string, { date: string; amount: number; count: number }>,
    );

    return Object.values(dailyData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }, [donations]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalAmount.toFixed(2)} SOL
          </div>
          <div className="text-sm text-muted-foreground">
            ${stats.totalUsdValue.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Donors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDonors}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Donation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageAmount.toFixed(2)} SOL
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Donation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  name="Amount (SOL)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
