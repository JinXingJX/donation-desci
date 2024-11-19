"use client";
import DonationdesciFeature from "@/components/donationdesci/donationdesci-feature";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const mockDonations: Donation[] = [
  {
    id: 1,
    donorName: "Alice Scientist",
    donorAvatar: "/placeholder.svg?height=100&width=100",
    twitterHandle: "alice_sci",
    amount: 10,
    usdValue: 2000,
    date: "2023-05-01",
    interval: 86400,
    totalAmount: 100,
    recipient: "Sci-Hub",
    recipientImage: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    donorName: "Bob Researcher",
    donorAvatar: "/placeholder.svg?height=100&width=100",
    twitterHandle: "bob_research",
    amount: 50,
    usdValue: 10000,
    date: "2023-05-02",
    interval: 604800,
    totalAmount: 500,
    recipient: "Sci-Hub",
    recipientImage: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    donorName: "Carol Engineer",
    donorAvatar: "/placeholder.svg?height=100&width=100",
    twitterHandle: "carol_eng",
    amount: 25,
    usdValue: 5000,
    date: "2023-05-03",
    interval: 2592000,
    totalAmount: 250,
    recipient: "Sci-Hub",
    recipientImage: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    donorName: "David Physicist",
    donorAvatar: "/placeholder.svg?height=100&width=100",
    twitterHandle: "david_phys",
    amount: 15,
    usdValue: 3000,
    date: "2023-05-04",
    interval: 86400,
    totalAmount: 150,
    recipient: "Sci-Hub",
    recipientImage: "/placeholder.svg?height=300&width=400",
  },
];

const recipients = [
  {
    name: "Sci-Hub",
    description:
      "Sci-Hub is a website that provides free access to millions of research papers and books by bypassing paywalls.",
    website: "https://sci-hub.se/",
  },
];

export default function Component() {
  const [amount, setAmount] = useState("");
  const [interval, setInterval] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [recipient, setRecipient] = useState("");
  const [donorName, setDonorName] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);

  const handleDonate = () => {
    if (!recipient) {
      alert("Please select a recipient");
      return;
    }

    const newDonation: Donation = {
      id: donations.length + 1,
      donorName,
      donorAvatar: "/placeholder.svg?height=100&width=100",
      twitterHandle,
      amount: parseFloat(amount) || 0,
      usdValue: (parseFloat(amount) || 0) * 200, // Mock USD conversion
      date: new Date().toISOString().split("T")[0],
      interval: parseInt(interval) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      recipient,
      recipientImage: "/placeholder.svg?height=300&width=400",
    };
    setDonations([newDonation, ...donations]);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setInterval("");
    setTotalAmount("");
    setStartTime("");
    setRecipient("");
    setDonorName("");
    setTwitterHandle("");
  };

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      if (donation.recipient) {
        if (!acc[donation.recipient]) {
          acc[donation.recipient] = [];
        }
        acc[donation.recipient].push(donation);
      }
      return acc;
    },
    {} as Record<string, Donation[]>,
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">donation-desci</h1>
      <p className="text-xl mb-8 text-center">
        Everyone can contribute to science{" "}
        <span className="font-bold text-primary">by meme</span>
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>
            Support scientific research with SOL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="amount">Interval Amount (SOL)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Interval (in seconds)</Label>
              <Input
                id="interval"
                type="number"
                placeholder="86400"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Amount (SOL)</Label>
              <Input
                id="total-amount"
                type="number"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select onValueChange={setRecipient} value={recipient}>
                      <SelectTrigger id="recipient">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipients.map((r) => (
                          <SelectItem key={r.name} value={r.name}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{recipients[0].description}</p>
                    <a
                      href={recipients[0].website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit website
                    </a>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              <Label htmlFor="donor-name">Your Name</Label>
              <Input
                id="donor-name"
                type="text"
                placeholder="Your name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter-handle">Twitter Handle</Label>
              <Input
                id="twitter-handle"
                type="text"
                placeholder="@your_handle"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                required
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button type="submit" className="w-full">
                  Donate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Donation</DialogTitle>
                  <DialogDescription>
                    You are about to donate {totalAmount} SOL to {recipient}.
                    The donation will be released in intervals of {amount} SOL
                    every {interval} seconds. Please confirm your donation.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleDonate}>Confirm Donation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Recent Donations</h2>
      {Object.entries(groupedDonations).map(
        ([recipient, recipientDonations]) => (
          <div key={recipient} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{recipient}</h3>
            <div className="flex flex-nowrap overflow-x-auto space-x-4 mb-4">
              {recipientDonations.slice(0, 3).map((donation) => (
                <Card key={donation.id} className="flex-shrink-0 w-72">
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
                        className="rounded-full border-2 border-white"
                        width={40}
                        height={40}
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
                          <Twitter className="w-4 h-4 mr-1" />@
                          {donation.twitterHandle}
                        </a>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p>
                      <strong>Amount:</strong> {donation.amount} SOL
                    </p>
                    <p>
                      <strong>Total:</strong> {donation.totalAmount} SOL
                    </p>
                    <p>
                      <strong>Date:</strong> {donation.date}
                    </p>
                    <Link
                      href={`/donations/${encodeURIComponent(recipient)}/${donation.id}`}
                      className="text-primary hover:underline"
                    >
                      View details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-right">
              <Link
                href={`/donations/${encodeURIComponent(recipient)}`}
                className="text-primary hover:underline"
              >
                View all donations for {recipient}
              </Link>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
