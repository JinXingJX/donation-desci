import { useState, useEffect } from "react";
import { Donation } from "../types";

interface UseDonationsOptions {
  recipient?: string;
  owner?: string;
  limit?: number;
}

export function useDonations({
  recipient,
  owner,
  limit = 50,
}: UseDonationsOptions = {}) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (recipient) params.append("recipient", recipient);
        if (owner) params.append("owner", owner);
        if (limit) params.append("limit", limit.toString());

        const response = await fetch(`/api/donations?${params}`);
        if (!response.ok) throw new Error("Failed to fetch donations");

        const data = await response.json();
        setDonations(data.donations);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [recipient, owner, limit]);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const lastDonation = donations[donations.length - 1];
      const params = new URLSearchParams({
        cursor: lastDonation.id,
        ...(recipient && { recipient }),
        ...(owner && { owner }),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/donations?${params}`);
      if (!response.ok) throw new Error("Failed to fetch more donations");

      const data = await response.json();
      setDonations((prev) => [...prev, ...data.donations]);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  return { donations, loading, error, hasMore, loadMore };
}
