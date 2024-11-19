import { useInView } from "react-intersection-observer";
import { useDonations } from "./hooks/useDonations";
import { DonationCard } from "./DonationCard";

interface DonationListProps {
  recipient?: string;
  owner?: string;
}

export function DonationList({ recipient, owner }: DonationListProps) {
  const { ref, inView } = useInView();
  const { donations, loading, error, hasMore, loadMore } = useDonations({
    recipient,
    owner,
    limit: 12,
  });

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.map((donation) => (
          <DonationCard key={donation.id} donation={donation} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      )}

      {!loading && hasMore && (
        <div ref={ref} className="h-20" /> // Infinite scroll trigger
      )}

      {!loading && !hasMore && donations.length > 0 && (
        <p className="text-center text-gray-500">No more donations to load</p>
      )}

      {!loading && donations.length === 0 && (
        <p className="text-center py-8">No donations found</p>
      )}
    </div>
  );
}
