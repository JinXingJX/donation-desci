// components/donations/DonationForm.tsx
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useDonationProgram } from "./DonationProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function DonationForm({
  onSuccess,
}: {
  onSuccess: (donation: any) => void;
}) {
  const wallet = useWallet();
  const { program } = useDonationProgram();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    interval: "86400", // 默认1天
    totalAmount: "",
    startTime: new Date().toISOString().split("T")[0],
    recipientPubkey: "",
    donorName: "",
    donorTwitter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey || !program) return;

    try {
      setLoading(true);

      // 1. 创建 PDA 账户
      const [donationAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("donation"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      // 2. 调用合约创建捐赠
      const tx = await program.methods
        .initializeDonation({
          totalAmount: new anchor.BN(parseFloat(formData.totalAmount) * 1e9),
          intervalAmount: new anchor.BN(parseFloat(formData.amount) * 1e9),
          intervalSeconds: new anchor.BN(parseInt(formData.interval)),
          startTime: new anchor.BN(
            new Date(formData.startTime).getTime() / 1000,
          ),
          donorInfo: {
            name: formData.donorName,
            twitterHandle: formData.donorTwitter,
          },
        })
        .accounts({
          owner: wallet.publicKey,
          donationAccount,
          recipient: new PublicKey(formData.recipientPubkey),
          // ... other required accounts
        })
        .rpc();

      // 3. 保存到数据库
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionSignature: tx,
          ownerPubkey: wallet.publicKey.toString(),
          recipientPubkey: formData.recipientPubkey,
          totalAmount: parseFloat(formData.totalAmount),
          intervalAmount: parseFloat(formData.amount),
          intervalSeconds: parseInt(formData.interval),
          startTime: formData.startTime,
          donorName: formData.donorName,
          donorTwitter: formData.donorTwitter,
          usdValue: parseFloat(formData.totalAmount) * 200, // 假设 1 SOL = $200
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save donation");
      }

      const donation = await response.json();

      toast({
        title: "Success!",
        description: "Your donation has been created successfully",
      });

      onSuccess(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create donation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields... */}
      <Button type="submit" disabled={loading || !wallet.connected}>
        {loading ? "Creating..." : "Create Donation"}
      </Button>
    </form>
  );
}
