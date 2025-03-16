"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RefreshCw, Info } from "lucide-react";

// Define the Claim type based on your Prisma schema.
interface Claim {
  id: string;
  secret: string;
  userId?: string;
  userEmail?: string;
  guestId?: string;
  sessionId: string;
  ip: string;
  used: boolean;
  couponId: string;
  coupon: {
    code: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Helper function to clip text to a specified maxLength
const clipText = (text: string | undefined, maxLength = 10) => {
  if (!text) return "-";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/admin/api/fetch-claims");
      if (!response.ok) throw new Error("Failed to fetch claims");
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch claims"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openClaimDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setIsDialogOpen(true);
  };

  const closeClaimDialog = () => {
    setIsDialogOpen(false);
    setSelectedClaim(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Claims Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review all coupon claims submitted by users.
          </p>
        </div>
        <Button onClick={fetchClaims} className="gap-2">
          <RefreshCw className="w-5 h-5" />
          Refresh Claims
        </Button>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border shadow-sm overflow-hidden dark:border-gray-800">
        <Table className="border-collapse w-full table-fixed">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[150px]">Coupon Code</TableHead>
              <TableHead className="w-[150px]">Session ID</TableHead>
              <TableHead className="w-[120px]">IP</TableHead>
              <TableHead className="w-[120px]">User ID</TableHead>
              <TableHead className="w-[180px]">User Email</TableHead>
              <TableHead className="w-[120px]">Guest ID</TableHead>
              <TableHead className="w-[100px] text-center">Used</TableHead>
              <TableHead className="w-[120px] text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
            ) : claims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                  No claims found
                </TableCell>
              </TableRow>
            ) : (
              claims.map((claim) => (
                <TableRow
                  key={claim.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 animate-in fade-in"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {claim.coupon.code}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {clipText(claim.sessionId)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {clipText(claim.ip)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {clipText(claim.userId)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {clipText(claim.userEmail)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {clipText(claim.guestId)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={claim.used ? "default" : "outline"}
                      className={cn({
                        "bg-green-100 text-green-800": claim.used,
                        "bg-red-100 text-red-800": !claim.used,
                      })}
                    >
                      {claim.used ? "Used" : "Unused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openClaimDialog(claim)}
                      className="flex items-center gap-1"
                    >
                      <Info className="w-4 h-4" />
                      View Info
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Claim Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeClaimDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Coupon Code:</strong> {selectedClaim?.coupon.code}
            </p>
            <p>
              <strong>Session ID:</strong> {selectedClaim?.sessionId}
            </p>
            <p>
              <strong>IP:</strong> {selectedClaim?.ip}
            </p>
            <p>
              <strong>User ID:</strong> {selectedClaim?.userId || "-"}
            </p>
            <p>
              <strong>User Email:</strong> {selectedClaim?.userEmail || "-"}
            </p>
            <p>
              <strong>Guest ID:</strong> {selectedClaim?.guestId || "-"}
            </p>
            <p>
              <strong>Used:</strong> {selectedClaim?.used ? "Used" : "Unused"}
            </p>
            <p>
              <strong>Secret:</strong> {selectedClaim?.secret}
            </p>
            <p>
              <strong>Created At:</strong> {selectedClaim?.createdAt}
            </p>
            <p>
              <strong>Updated At:</strong> {selectedClaim?.updatedAt}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={closeClaimDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
