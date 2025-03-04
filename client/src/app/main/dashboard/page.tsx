"use client";

import { useEffect, useState } from "react";
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
    BarElement,
    BarController,
    ScatterController,
} from "chart.js";
import { Line, Pie, Bar, Scatter } from "react-chartjs-2";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import MultipleSelectCheckmarks from "./authorOptions";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    BarController,
    ScatterController,
    Title,
    Tooltip,
    Legend
);

// Interfaces
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

interface CategoryData {
    category_name: string;
    count: number;
}

interface PriceTrend {
    month: string;
    avg_price: number;
}

interface RatingTrend {
    month: string;
    avg_rating: number;
    book_count: number;
}

interface BookDistribution {
    category_name: string;
    count: number;
    avg_price: number;
    avg_rating: number;
    bestseller_count: number;
}

interface MonthlyStats {
    month: string;
    category_name: string;
    book_count: number;
    avg_price: number;
    avg_rating: number;
    bestseller_count: number;
    kindle_count: number;
}

interface DashboardStats {
    totalBooks: number;
    bestSellers: number;
    avgPrice: number;
    newBooks: number;
    uniqueAuthors: number;
    avgReviews: number;
    affordableBooks: number;
    highlyRated: number;
    kindleUnlimited: number;
    editorsPicks: number;
}

interface AuthorBook {
    _id: string;
    author: string; // Added this field
    title: string;
    stars: number;
    reviews: number;
    price: number;
    is_best_seller: boolean;
    username?: string;
    collection_name?: string;
}

// Helper function to generate color scale
function generateColorScale(
    steps: number,
    colorScheme: "RdBu" | "BuRd" = "RdBu"
): string[] {
    const colors = [];
    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        colors.push(
            colorScheme === "RdBu"
                ? `rgb(${Math.round(33 + t * 222)}, ${Math.round(102 + t * 21)}, ${Math.round(172 - t * 115)})`
                : `rgb(${Math.round(222 - t * 189)}, ${Math.round(123 + t * 21)}, ${Math.round(57 + t * 115)})`
        );
    }
    return colors;
}

// Card Component
const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div
            className={`bg-secondary border-border rounded-lg border p-4 shadow-sm ${className}`}
        >
            {children}
        </div>
    );
};

export default function DashboardPage() {
    // State declarations
    const [stats, setStats] = useState<DashboardStats>({
        totalBooks: 0,
        bestSellers: 0,
        avgPrice: 0,
        newBooks: 0,
        uniqueAuthors: 0,
        avgReviews: 0,
        affordableBooks: 0,
        highlyRated: 0,
        kindleUnlimited: 0,
        editorsPicks: 0,
    });
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
    const [ratingTrends, setRatingTrends] = useState<RatingTrend[]>([]);
    const [bookDistribution, setBookDistribution] = useState<
        BookDistribution[]
    >([]);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]);
    const [authorBooks, setAuthorBooks] = useState<AuthorBook[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:8080/dashboard/extended-stats"),
            fetch("http://localhost:8080/dashboard/categories"),
            fetch("http://localhost:8080/dashboard/price-trends"),
            fetch("http://localhost:8080/dashboard/ratings-trend"),
            fetch("http://localhost:8080/dashboard/book-distribution"),
            fetch("http://localhost:8080/dashboard/monthly-stats"),
        ]).then(
            async ([
                statsRes,
                categoriesRes,
                priceRes,
                ratingsRes,
                distributionRes,
                monthlyRes,
            ]) => {
                const stats = await statsRes.json();
                const categories = await categoriesRes.json();
                const prices = await priceRes.json();
                const ratings = await ratingsRes.json();
                const distribution = await distributionRes.json();
                const monthly = await monthlyRes.json();

                setStats(stats);
                setCategoryData(categories);
                setPriceTrends(prices);
                setRatingTrends(ratings);
                setBookDistribution(distribution);
                setMonthlyStats(monthly);
            }
        );
    }, []);

    useEffect(() => {
        if (selectedAuthor.length > 0) {
            setLoading(true);
            // Fetch books for the selected author
            fetch(
                `http://localhost:8080/author-books/${encodeURIComponent(selectedAuthor[0])}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setAuthorBooks(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [selectedAuthor]);

    // Chart Data Configurations
    const pieChartData = {
        labels: bookDistribution.map((c) => c.category_name),
        datasets: [
            {
                data: bookDistribution.map((c) => c.count),
                backgroundColor: generateColorScale(
                    bookDistribution.length,
                    "RdBu"
                ),
            },
        ],
    };

    const lineChartData = {
        labels: priceTrends.map((t) =>
            new Date(t.month).toLocaleDateString("en-US", { month: "short" })
        ),
        datasets: [
            {
                label: "Average Price",
                data: priceTrends.map((t) => t.avg_price),
                borderColor: "rgb(138, 43, 226)",
                backgroundColor: "rgba(138, 43, 226, 0.1)",
                tension: 0.1,
                fill: true,
            },
        ],
    };

    const ratingTrendData = {
        labels: ratingTrends.map((t) =>
            new Date(t.month).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
            })
        ),
        datasets: [
            {
                label: "Average Rating",
                data: ratingTrends.map((t) => t.avg_rating),
                borderColor: "rgb(138, 43, 226)",
                backgroundColor: "rgba(138, 43, 226, 0.1)",
                yAxisID: "y",
                tension: 0.1,
                fill: true,
            },
            {
                label: "Number of Books",
                data: ratingTrends.map((t) => t.book_count),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.1)",
                yAxisID: "y1",
                tension: 0.1,
                fill: true,
            },
        ],
    };

    const categoryBarData = {
        labels: bookDistribution.map((c) => c.category_name),
        datasets: [
            {
                label: "Total Books",
                data: bookDistribution.map((c) => c.count),
                backgroundColor: generateColorScale(bookDistribution.length),
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
            },
            {
                label: "Bestsellers",
                data: bookDistribution.map((c) => c.bestseller_count),
                backgroundColor: generateColorScale(
                    bookDistribution.length,
                    "BuRd"
                ),
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
            },
        ],
    };

    const scatterData = {
        datasets: monthlyStats.map((stat, index) => ({
            label: stat.category_name,
            data: [
                {
                    x: stat.avg_price,
                    y: stat.avg_rating,
                    r: Math.sqrt(stat.book_count) * 2,
                },
            ],
            backgroundColor: generateColorScale(monthlyStats.length)[index],
        })),
    };

    const areaChartData = {
        labels: [
            ...new Set(
                monthlyStats.map((s) =>
                    new Date(s.month).toLocaleDateString("en-US", {
                        month: "short",
                        year: "2-digit",
                    })
                )
            ),
        ],
        datasets: [
            "Literature & Fiction",
            "Science Fiction & Fantasy",
            "Mystery, Thriller & Suspense",
            "Romance",
        ].map((category, index) => ({
            label: category,
            data: monthlyStats
                .filter((s) => s.category_name === category)
                .map((s) => s.book_count),
            fill: true,
            backgroundColor: `rgba${generateColorScale(4)[index].slice(3, -1)}, 0.3)`,
            borderColor: generateColorScale(4)[index],
            tension: 0.4,
        })),
    };

    const AuthorBooksTable = () => (
        <TableContainer component={Paper} sx={{ backgroundColor: "#14121F" }}>
            <Table
                sx={{
                    minWidth: 650,
                    "& .MuiTableCell-root": { color: "white" },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Author</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell align="right">Rating</TableCell>
                        <TableCell align="right">Reviews</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Best Seller</TableCell>
                        <TableCell>Saved By</TableCell>
                        <TableCell>Collection</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {authorBooks.map((book, index) => (
                        <TableRow
                            key={`${book._id}-${book.username || "none"}-${book.collection_name || "none"}-${index}`}
                        >
                            <TableCell component="th" scope="row">
                                {book.author}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {book.title}
                            </TableCell>
                            <TableCell align="right">{book.stars}</TableCell>
                            <TableCell align="right">{book.reviews}</TableCell>
                            <TableCell align="right">${book.price}</TableCell>
                            <TableCell align="center">
                                {book.is_best_seller ? "✓" : "-"}
                            </TableCell>
                            <TableCell>{book.username || "-"}</TableCell>
                            <TableCell>{book.collection_name || "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // Modify authorOptions.tsx to accept props
    const handleAuthorSelect = (authors: string[]) => {
        setSelectedAuthor(authors);
    };

    return (
        <div className="ml-[220px] flex min-h-screen flex-col gap-4 space-y-6 bg-[#1a1a1a] p-6">
            <h1 className="text-2xl font-bold text-white">General View</h1>

            {/* Stats Grid - First Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">Total Books</h3>
                    <p className="text-2xl">
                        {stats.totalBooks.toLocaleString()}
                    </p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">
                        Best Sellers
                    </h3>
                    <p className="text-2xl">
                        {stats.bestSellers.toLocaleString()}
                    </p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">
                        Unique Authors
                    </h3>
                    <p className="text-2xl">
                        {stats.uniqueAuthors.toLocaleString()}
                    </p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">
                        Highly Rated
                    </h3>
                    <p className="text-2xl">
                        {stats.highlyRated.toLocaleString()}
                    </p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">
                        Editors Picks
                    </h3>
                    <p className="text-2xl">
                        {stats.editorsPicks.toLocaleString()}
                    </p>
                </Card>
            </div>

            {/* Stats Grid - Second Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">
                        Average Price
                    </h3>
                    <p className="text-2xl">${stats.avgPrice}</p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">New Books</h3>
                    <p className="text-2xl">
                        {stats.newBooks.toLocaleString()}
                    </p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">Avg Reviews</h3>
                    <p className="text-2xl">{stats.avgReviews}</p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">Under $10</h3>
                    <p className="text-2xl">
                        {stats.affordableBooks.toLocaleString()}
                    </p>
                </Card>
                <Card className="border-none bg-[#2a2a2a] text-white">
                    <h3 className="font-semibold text-gray-400">
                        Kindle Unlimited
                    </h3>
                    <p className="text-2xl">
                        {stats.kindleUnlimited.toLocaleString()}
                    </p>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="col-span-1 border-none bg-[#2a2a2a] text-white">
                    <h3 className="mb-4 font-semibold">
                        Category Distribution
                    </h3>
                    <Pie
                        data={pieChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: "bottom",
                                    labels: { color: "white" },
                                },
                            },
                        }}
                    />
                </Card>

                <Card className="col-span-1 border-none bg-[#2a2a2a] text-white">
                    <h3 className="mb-4 font-semibold">Price Trends</h3>
                    <Line
                        data={lineChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    labels: { color: "white" },
                                },
                            },
                            scales: {
                                y: {
                                    ticks: { color: "white" },
                                    grid: { color: "rgba(255,255,255,0.1)" },
                                },
                                x: {
                                    ticks: { color: "white" },
                                    grid: { color: "rgba(255,255,255,0.1)" },
                                },
                            },
                        }}
                    />
                </Card>
            </div>

            {/* Full Width Charts */}
            <Card className="border-none bg-[#2a2a2a] text-white">
                <h3 className="mb-4 font-semibold">
                    Ratings & Publication Trend
                </h3>
                <Line
                    data={ratingTrendData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { labels: { color: "white" } },
                        },
                        scales: {
                            y: {
                                type: "linear",
                                display: true,
                                position: "left",
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                            y1: {
                                type: "linear",
                                display: true,
                                position: "right",
                                ticks: { color: "white" },
                                grid: { display: false },
                            },
                            x: {
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                        },
                    }}
                />
            </Card>

            {/* Category Distribution Bar Chart */}
            <Card className="border-none bg-[#2a2a2a] text-white">
                <h3 className="mb-4 font-semibold">
                    Category Distribution & Bestsellers
                </h3>
                <Bar
                    data={categoryBarData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { labels: { color: "white" } },
                        },
                        scales: {
                            y: {
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                            x: {
                                ticks: {
                                    color: "white",
                                    maxRotation: 45,
                                    minRotation: 45,
                                },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                        },
                    }}
                />
            </Card>

            {/* Scatter Plot */}
            <Card className="border-none bg-[#2a2a2a] text-white">
                <h3 className="mb-4 font-semibold">
                    Price vs Rating Distribution
                </h3>
                <Scatter
                    data={scatterData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                                labels: { color: "white" },
                            },
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: "Average Rating",
                                    color: "white",
                                },
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: "Average Price ($)",
                                    color: "white",
                                },
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                        },
                    }}
                />
            </Card>

            {/* Area Chart */}
            <Card className="border-none bg-[#2a2a2a] text-white">
                <h3 className="mb-4 font-semibold">Popular Categories Trend</h3>
                <Line
                    data={areaChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { labels: { color: "white" } },
                        },
                        scales: {
                            y: {
                                stacked: true,
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                            x: {
                                ticks: { color: "white" },
                                grid: { color: "rgba(255,255,255,0.1)" },
                            },
                        },
                    }}
                />
            </Card>

            {/* Authors Tables */}
            <Card className="min-h-[400px] border-none bg-[#2a2a2a] text-white">
                <div className="mb-4">
                    <h3 className="mb-4 font-semibold">Authors Books</h3>
                    <MultipleSelectCheckmarks
                        value={selectedAuthor}
                        onChange={(authors: string[]) =>
                            setSelectedAuthor(authors)
                        }
                    />
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : selectedAuthor.length > 0 ? (
                    <AuthorBooksTable />
                ) : (
                    <div>Please select an author to view their books</div>
                )}
            </Card>
        </div>
    );
}
