import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOptions {
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  recipient?: string;
}

interface DonationFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  recipients: Array<{ name: string; pubkey: string }>;
}

export function DonationFilters({
  onFilterChange,
  recipients,
}: DonationFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Min Amount (SOL)</Label>
            <Input
              type="number"
              value={filters.minAmount || ""}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Amount (SOL)</Label>
            <Input
              type="number"
              value={filters.maxAmount || ""}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Recipient</Label>
            <Select
              value={filters.recipient}
              onValueChange={(value) => handleFilterChange("recipient", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All recipients" />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.pubkey} value={recipient.pubkey}>
                    {recipient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
