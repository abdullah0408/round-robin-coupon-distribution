"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import ChartJS and react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardMetrics {
  totalClaims: number;
  usedClaims: number;
  unusedClaims: number;
  totalCoupons: number;
  activeCoupons: number;
  inactiveCoupons: number;
  claimsOverTime: { date: string; count: number }[];
  couponUsageOverTime: { date: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClaims: 0,
    usedClaims: 0,
    unusedClaims: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    inactiveCoupons: 0,
    claimsOverTime: [],
    couponUsageOverTime: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to format date as YYYY-MM-DD for table display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Helper function to format date as MM-DD for charts
  const formatMonthDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${formattedMonth}-${formattedDay}`;
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/admin/api/dashboard-metrics");
      if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load metrics"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data for claims over time using month-date labels
  const claimsChartData = {
    labels: metrics.claimsOverTime.map((item) => formatMonthDate(item.date)),
    datasets: [
      {
        label: "Claims",
        data: metrics.claimsOverTime.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for coupon usage over time using month-date labels
  const couponChartData = {
    labels: metrics.couponUsageOverTime.map((item) =>
      formatMonthDate(item.date)
    ),
    datasets: [
      {
        label: "Coupon Usage",
        data: metrics.couponUsageOverTime.map((item) => item.count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "" },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Get a quick look at the overall claims and coupon usage.
          </p>
        </div>
        <Button onClick={fetchDashboardMetrics} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.totalClaims}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Used Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.usedClaims}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unused Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.unusedClaims}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.totalCoupons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.activeCoupons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inactive Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.inactiveCoupons}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claims Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={claimsChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: "Claims Over Time" },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Coupon Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={couponChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: "Coupon Usage Over Time" },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Daily Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Last{" "}
            {metrics.claimsOverTime.length > 0
              ? metrics.claimsOverTime.length
              : "_"}{" "}
            {metrics.claimsOverTime.length === 1 ? "Day" : "Days"} Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Claims</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.claimsOverTime.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
