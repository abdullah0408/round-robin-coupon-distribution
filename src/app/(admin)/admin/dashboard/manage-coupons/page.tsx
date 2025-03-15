"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit2, Loader2, PlusCircle, Trash } from "lucide-react";
import type { Coupon } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const couponSchema = z.object({
  code: z.string().min(1, "Required").trim(),
  totalissued: z.number().min(1, "Minimum 1"),
  status: z.boolean(),
});

type CouponFormData = z.infer<typeof couponSchema>;

export default function AdminDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [dialogType, setDialogType] = useState<
    "add" | "edit" | "delete" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "", totalissued: 0, status: true },
  });

  const statusValue = watch("status");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/admin/api/fetch-coupons");
      if (!response.ok) throw new Error("Failed to fetch coupons");
      setCoupons(await response.json());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch coupons"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: CouponFormData) => {
    try {
      setIsSubmitLoading(true);
      const couponData = {
        code: data.code.trim(),
        totalissued: data.totalissued,
        status: data.status ? "Active" : "Inactive",
      };

      const url =
        dialogType === "add"
          ? "/admin/api/create-coupon"
          : `/admin/api/update-coupon`;
      const method = dialogType === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          dialogType === "add"
            ? couponData
            : { ...couponData, id: selectedCoupon?.id }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast.success(
        `Coupon ${dialogType === "add" ? "added" : "updated"} successfully`
      );
      fetchCoupons();
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;
    try {
      setIsSubmitLoading(true);
      const response = await fetch(
        `/admin/api/delete-coupon?id=${selectedCoupon.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete coupon");

      toast.success("Coupon deleted successfully");
      fetchCoupons();
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const openDialog = (type: "add" | "edit" | "delete", coupon?: Coupon) => {
    setDialogType(type);
    if (coupon) {
      setSelectedCoupon(coupon);
      if (type === "edit") {
        setValue("code", coupon.code);
        setValue("totalissued", coupon.totalissued);
        setValue("status", coupon.status === "Active");
      }
    }
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedCoupon(null);
    reset();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Coupon Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage promotional codes and their distribution
          </p>
        </div>
        <Button onClick={() => openDialog("add")} className="gap-2">
          <PlusCircle className="w-5 h-5" />
          Add Coupon
        </Button>
      </div>

      {/* Table Section */}
      {/* Table Section with Stable Layout */}
      <div className="rounded-lg border shadow-sm overflow-hidden dark:border-gray-800">
        <Table className="border-collapse w-full table-fixed">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Code</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">Total</TableHead>
              <TableHead className="w-[100px] text-right">Used</TableHead>
              <TableHead className="w-[120px] text-right">Remaining</TableHead>
              <TableHead className="w-[200px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {isLoading ? (
              // Skeleton Loader
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded ml-auto w-10 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded ml-auto w-10 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded ml-auto w-10 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-gray-500"
                >
                  No coupons found
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow
                  key={coupon.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 animate-in fade-in"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {coupon.code}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        coupon.status === "Active" ? "default" : "outline"
                      }
                      className={cn({
                        "bg-green-100 text-green-800":
                          coupon.status === "Active",
                        "bg-red-100 text-red-800": coupon.status !== "Active",
                      })}
                    >
                      {coupon.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {coupon.totalissued}
                  </TableCell>
                  <TableCell className="text-right">
                    {coupon.totalused}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {coupon.totalissued - coupon.totalused}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDialog("edit", coupon)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDialog("delete", coupon)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogType === "add" || dialogType === "edit"}
        onOpenChange={closeDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {dialogType === "add" ? "Create New Coupon" : "Update Coupon"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "add"
                ? "Generate a new promotional code"
                : "Modify existing coupon details"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="code" className="block mb-2">
                  Coupon Code
                </Label>
                <Input
                  id="code"
                  {...register("code")}
                  placeholder="SUMMER25"
                  className={cn("focus-visible:ring-primary", {
                    "border-red-500": errors.code,
                  })}
                />
                {errors.code && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="totalissued" className="block mb-2">
                  Total Issued
                </Label>
                <Input
                  id="totalissued"
                  type="number"
                  {...register("totalissued", { valueAsNumber: true })}
                  className={cn("focus-visible:ring-primary", {
                    "border-red-500": errors.totalissued,
                  })}
                />
                {errors.totalissued && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.totalissued.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="block font-medium">Status</Label>
                  <p className="text-sm text-gray-500">
                    {statusValue ? "Active" : "Inactive"}
                  </p>
                </div>
                <Switch
                  checked={statusValue}
                  onCheckedChange={(checked) => setValue("status", checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitLoading}
              >
                {isSubmitLoading ? (
                  <Loader2 className="animate-spin w-5 h-5 mx-4" />
                ) : dialogType === "add" ? (
                  "Create Coupon"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogType === "delete"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Coupon</DialogTitle>
            <DialogDescription>
              This action will permanently remove the coupon from your system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete coupon{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedCoupon?.code}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeDialog}
                disabled={isSubmitLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Delete Coupon"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
