"use client";

import { useEffect, useState, useRef } from "react";
import { Ticket, Copy, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Claims {
  id: string;
  coupon: {
    code: string;
    status: string;
  };
  createdAt: string;
  used: boolean;
  secret: string;
}

type GeneratedCoupon = {
  code: string;
  secret: string;
  showSecret: boolean;
};

export default function UserCouponPage() {
  const [generatedCoupon, setGeneratedCoupon] = useState<GeneratedCoupon | null>(null);
  const [claims, setClaims] = useState<Claims[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // For coupon history secret toggle – only one open at a time.
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const claimTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchClaims();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (claimTimerRef.current) clearTimeout(claimTimerRef.current);
    };
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await fetch("/api/fetch-coupons");
      if (!response.ok) throw new Error("Failed to load claims");
      setClaims(await response.json());
    } catch (error) {
      toast.error(
        `Failed to load claims: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCoupon = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/get-coupon");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      setGeneratedCoupon({ code: data.code, secret: data.secret, showSecret: false });
      toast.success("Coupon generated successfully!");
      fetchClaims();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setGeneratedCoupon(null);
      }, 15000);
    } catch (error) {
      let message = "Coupon generation failed";
      let suggestion = "Please try again later.";

      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          message = errorData.message || message;
          suggestion = errorData.suggestion || suggestion;
        } catch {
          message = error.message;
        }
      }

      toast.error(
        <div className="flex flex-col">
          <p>{message}</p>
          <p className="text-xs mt-1 text-gray-600">{suggestion}</p>
        </div>
      );

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setGeneratedCoupon(null);
      }, 15000);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  const toggleSecret = (claimId: string) => {
    // If the clicked claim is already active, close it and clear the timer.
    if (activeClaimId === claimId) {
      setActiveClaimId(null);
      if (claimTimerRef.current) {
        clearTimeout(claimTimerRef.current);
        claimTimerRef.current = null;
      }
    } else {
      // Open new claim and close any previously open secret.
      setActiveClaimId(claimId);
      if (claimTimerRef.current) {
        clearTimeout(claimTimerRef.current);
      }
      claimTimerRef.current = setTimeout(() => {
        setActiveClaimId(null);
        claimTimerRef.current = null;
      }, 15000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Coupon Generation Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get Your Coupon</h1>
          {generatedCoupon ? (
            <>
              {/* Coupon details rendered horizontally */}
              <div className="bg-gray-100 rounded-lg shadow-md flex items-center px-4 h-16">
                {/* Left 1/4 for coupon code */}
                <div className="flex items-center w-1/4">
                  <span className="text-lg font-bold text-green-700">{generatedCoupon.code}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedCoupon.code)}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {/* Right 3/4 for coupon secret */}
                <div className="flex items-center w-3/4 justify-end gap-2">
                  <div className="flex-1 bg-gray-200 px-3 py-1 rounded h-10 flex items-center overflow-x-auto">
                    <code className="font-mono text-lg whitespace-nowrap">
                      {generatedCoupon.showSecret ? generatedCoupon.secret : "••••••••••"}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setGeneratedCoupon(prev =>
                        prev ? { ...prev, showSecret: !prev.showSecret } : null
                      )
                    }
                  >
                    {generatedCoupon.showSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedCoupon.secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">
                This coupon will be hidden in 15 seconds
              </p>
            </>
          ) : (
            <div className="flex justify-center">
              <Button
                onClick={handleGetCoupon}
                disabled={isGenerating}
                className="gap-2 px-8 py-4 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Ticket className="h-5 w-5" />
                    Get Coupon
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Claim History Section */}
        <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-6 border-b">Your Coupon History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Coupon Code</TableCell>
                <TableCell>Secret</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Claimed</TableCell>
                <TableCell>Used</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No coupons claimed yet
                  </TableCell>
                </TableRow>
              ) : (
                claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Fixed-width container for coupon code */}
                        <div className="w-24 overflow-x-auto">
                          <span className="text-sm">{claim.coupon.code}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(claim.coupon.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Fixed-width container to prevent layout shift for secret */}
                        <div className="w-56 overflow-x-auto">
                          <code className="font-mono text-sm">
                            {activeClaimId === claim.id ? claim.secret : "••••••••"}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecret(claim.id)}
                        >
                          {activeClaimId === claim.id ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(claim.secret)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={claim.coupon.status === "Active" ? "default" : "secondary"}>
                        {claim.coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={claim.used ? "destructive" : "outline"}>
                        {claim.used ? "Used" : "Unused"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
