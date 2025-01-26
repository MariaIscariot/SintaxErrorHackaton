"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = () => {
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQualityScore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://0411-93-113-114-106.ngrok-free.app/quality_score",
        {
          news_url:
            "https://noi.md/ru/politika/o-chem-govorili-majya-sandu-i-vladimir-zelenskij-na-vstreche-v-kieve",
          lang: "ron",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const percent = response.data?.percent;
      if (percent === undefined) {
        throw new Error("Invalid response format: 'percent' field missing");
      }

      setQualityScore(percent);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualityScore();
  }, []);

  const getBarColor = (score: number | null) => {
    if (score === null) return "#E5E5E5";
    if (score < 30) return "#F44336"; // Red for low score
    if (score < 70) return "#FFC107"; // Yellow for medium score
    return "#4CAF50"; // Green for high score
  };

  const chartData = [
    {
      name: "Quality Score",
      value: qualityScore ?? 0,
      fill: getBarColor(qualityScore),
    },
    {
      name: "Remaining",
      value: 100 - (qualityScore ?? 0),
      fill: "#FFC107",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Quality Score</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : qualityScore !== null ? (
        <div className="relative w-full h-[75%]">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="80%"
              barSize={32}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar background dataKey="value" />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-2xl font-bold">
              {qualityScore.toFixed(1)}%
            </h1>
            <p className="text-sm text-gray-400">Quality Score</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">No data available</div>
      )}
    </div>
  );
};

export default CountChart;
