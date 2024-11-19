export interface Donation {
  id: string;
  ownerPubkey: string;
  mintPubkey: string;
  recipientPubkey: string;
  totalAmount: number;
  intervalAmount: number;
  intervalSeconds: number;
  claimedAmount: number;
  startTime: string;
  donorName: string;
  donorTwitter?: string;
  usdValue: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
}
