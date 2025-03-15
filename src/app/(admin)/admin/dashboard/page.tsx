"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Coupon } from "@prisma/client";

export default function AdminDashboard() {
  const [newCoupon, setNewCoupon] = useState({ code: "", total: 0, status: true });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/admin/api/fetch-coupons");
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        console.error("Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || newCoupon.total <= 0) {
      alert("Please enter a valid coupon code and total issued amount.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/admin/api/create-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: newCoupon.code,
          totalissued: newCoupon.total,
          status: newCoupon.status ? "Active" : "Inactive",
        }),
      });

      if (response.ok) {
        alert("Coupon added successfully!");
        setNewCoupon({ code: "", total: 0, status: true });
        setIsAddDialogOpen(false);
        fetchCoupons();
      } else {
        const errorData = await response.json();
        alert("Failed to add coupon: " + errorData.message);
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
        Add Coupon
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Issued</TableHead>
            <TableHead>Claimed</TableHead>
            <TableHead>Left to Claim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon: Coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.status}</TableCell>
              <TableCell>{coupon.totalissued}</TableCell>
              <TableCell>{coupon.totalused}</TableCell>
              <TableCell>{coupon.totalissued - coupon.totalused}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label>Coupon Code</label>
            <Input
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            />
            <label>Total Issued</label>
            <Input
              type="number"
              value={newCoupon.total}
              onChange={(e) => setNewCoupon({ ...newCoupon, total: parseInt(e.target.value) })}
            />
            <div className="flex items-center justify-between">
              <label>Status: {newCoupon.status ? "Active" : "Inactive"}</label>
              <Switch
                checked={newCoupon.status}
                onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, status: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCoupon} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Add Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
