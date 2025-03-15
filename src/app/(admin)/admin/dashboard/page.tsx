"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2, Trash } from "lucide-react";
import { Coupon } from "@prisma/client";

export default function AdminDashboard() {
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    total: 0,
    status: true,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const handleUpdateCoupon = async () => {
    if (!selectedCoupon?.code || selectedCoupon?.totalissued < 0) {
      alert("Please enter valid coupon details.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/admin/api/update-coupon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCoupon),
      });

      if (response.ok) {
        alert("Coupon updated successfully!");
        setIsUpdateDialogOpen(false);
        fetchCoupons();
      } else {
        const errorData = await response.json();
        alert("Failed to update coupon: " + errorData.message);
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open the update dialog
  const openUpdateDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsUpdateDialogOpen(true);
  };

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

  const handleDeleteCoupon = async ({ id }: Coupon) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const response = await fetch(`/admin/api/delete-coupon?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Coupon deleted successfully!");
        fetchCoupons();
      } else {
        alert("Failed to delete coupon.");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Something went wrong. Please try again.");
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
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() => openUpdateDialog(coupon)}
                >
                  Update
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteCoupon(coupon)}
                  className="ml-2"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Coupon</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4">
              <label>Coupon Code</label>
              <Input
                value={selectedCoupon.code}
                onChange={(e) =>
                  setSelectedCoupon({ ...selectedCoupon, code: e.target.value })
                }
              />
              <label>Total Issued</label>
              <Input
                type="number"
                value={selectedCoupon.totalissued}
                onChange={(e) =>
                  setSelectedCoupon({
                    ...selectedCoupon,
                    totalissued: parseInt(e.target.value),
                  })
                }
              />
              <div className="flex items-center justify-between">
                <label>
                  Status: {selectedCoupon.status ? "Active" : "Inactive"}
                </label>
                <Switch
                  checked={selectedCoupon.status === "Active"}
                  onCheckedChange={(checked) =>
                    setSelectedCoupon({ ...selectedCoupon, status: checked ? "Active" : "Inactive" })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateCoupon} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Coupon"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label>Coupon Code</label>
            <Input
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
            />
            <label>Total Issued</label>
            <Input
              type="number"
              value={newCoupon.total}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, total: parseInt(e.target.value) })
              }
            />
            <div className="flex items-center justify-between">
              <label>Status: {newCoupon.status ? "Active" : "Inactive"}</label>
              <Switch
                checked={newCoupon.status}
                onCheckedChange={(checked) =>
                  setNewCoupon({ ...newCoupon, status: checked })
                }
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
