"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmotionChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmotionData = async () => {
      try {
        const response = await axios.post(
          "https://0411-93-113-114-106.ngrok-free.app/psycho",
          {
            news_url:
              "https://moldova.europalibera.org/a/trump-si-a-pus-in-miscare-tavalugul-conservator-zeci-de-ordine-executive-impotriva-imigratiei-diversitatii-sau-protectiei-mediului/33283154.html",
            lang: "ron",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        if (Array.isArray(response.data)) {
          console.log("API Response:", response.data);
          const formattedData = response.data.map(({ emotion, value }: { emotion: string, value: number }) => ({
            emotion,
            value: value * 100,
          }));
          console.log("Formatted Data for Chart:", formattedData);
          setData(formattedData);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err: any) {
        console.error("Failed to fetch emotion data:", err);
        setError(err.message || "Unable to load emotion data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 h-[600px]">
      <h1 className="text-xl font-semibold mb-4">Emotion Analysis</h1>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading data...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="emotion"
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickLine={false}
              interval={0}
              tickMargin={12}
              angle={-10}
              textAnchor="end"
            />
            <YAxis
              domain={[0, 20]}
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
              formatter={(value: number) => `${value.toFixed(2)}%`}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "20px", paddingBottom: "10px" }}
            />
            <Bar
              dataKey="value"
              fill="#8884d8"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EmotionChart;
