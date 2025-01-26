"use client";
import axios from "axios";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// // Axios client for interacting with the FastAPI backend
// const apiClient = axios.create({
//   baseURL: "https://0411-93-113-114-106.ngrok-free.app", // URL of your FastAPI backend
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// Static fallback data for the chart
const staticData = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sep", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

// Finance Chart Component
const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-700">Finance Overview</h1>
        <Image
          src="/moreDark.png"
          alt="More options"
          width={20}
          height={20}
        />
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={staticData} // Replace with dynamic data when available
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{
              paddingTop: "10px",
              paddingBottom: "20px",
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#34D399" // Tailwind green-400
            strokeWidth={4}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#F87171" // Tailwind red-400
            strokeWidth={4}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Fetch items from the backend
// export const fetchItems = async () => {
//   try {
//     const response = await apiClient.get("/items");
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch items:", error);
//     throw error; // Rethrow for external handling if needed
//   }
// };

export default FinanceChart;