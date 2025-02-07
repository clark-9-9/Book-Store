"use client";

import { Card } from "@/components/ui/card";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardPage() {
    // Sample data for the charts
    const lineChartData = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                label: "Monthly Sales",
                data: [65, 59, 80, 81, 56, 55],
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };

    const pieChartData = {
        labels: ["Product A", "Product B", "Product C", "Product D"],
        datasets: [
            {
                data: [12, 19, 3, 5],
                backgroundColor: [
                    "rgba(138, 43, 226, 0.8)",
                    "rgba(147, 112, 219, 0.8)",
                    "rgba(153, 50, 204, 0.8)",
                    "rgba(186, 85, 211, 0.8)",
                ],
            },
        ],
    };

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">General View</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card className="p-4">
                    <h3 className="font-semibold">Total Sales</h3>
                    <p className="text-2xl">$12,345</p>
                </Card>
                <Card className="p-4">
                    <h3 className="font-semibold">Total Orders</h3>
                    <p className="text-2xl">234</p>
                </Card>
                <Card className="p-4">
                    <h3 className="font-semibold">Active Users</h3>
                    <p className="text-2xl">1,234</p>
                </Card>
                <Card className="p-4">
                    <h3 className="font-semibold">Conversion Rate</h3>
                    <p className="text-2xl">2.4%</p>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h3 className="mb-4 font-semibold">Sales Trend</h3>
                    <Line data={lineChartData} options={{ responsive: true }} />
                </Card>
                <Card className="p-4">
                    <h3 className="mb-4 font-semibold">Product Distribution</h3>
                    <Pie data={pieChartData} options={{ responsive: true }} />
                </Card>
            </div>

            {/* Prices Section */}
            <div>
                <h2 className="mb-4 text-2xl font-bold">Prices</h2>
                <Card className="p-4">
                    {/* Add your prices table or content here */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Add price cards or table here */}
                    </div>
                </Card>
            </div>
        </div>
    );
}
