"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [newCoupon, setNewCoupon] = useState({ code: "", total: 0, status: true });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const coupons = [
    { id: 1, code: "COUPON1", status: "ACTIVE", total: 100, used: 50 },
    { id: 2, code: "COUPON2", status: "INACTIVE", total: 200, used: 100 },
  ];

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
            <TableHead>Enable/Disable</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.status}</TableCell>
              <TableCell>{coupon.total}</TableCell>
              <TableCell>{coupon.used}</TableCell>
              <TableCell>{coupon.total - coupon.used}</TableCell>
              <TableCell>
                <Switch 
                //   checked={coupon.status === "ACTIVE"} 
                  // onCheckedChange={() => handleStatusToggle(coupon.id, coupon.status)}
                />
              </TableCell>
              <TableCell>
                {/* <Button variant="outline" onClick={() => handleEdit(coupon)} size="sm">Edit</Button> */}
                {/* <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteCoupon(coupon.id)}>Delete</Button> */}
              </TableCell>
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
