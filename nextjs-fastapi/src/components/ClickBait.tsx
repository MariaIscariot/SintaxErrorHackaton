"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const ClickBait = () => {
  const [clickbaitScore, setClickbaitScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClickbaitScore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://0411-93-113-114-106.ngrok-free.app/clickbait",
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

      setClickbaitScore(percent);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClickbaitScore();
  }, []);

  // Функция для определения цвета бара
  const getBarColor = (score: number | null) => {
    if (score === null) return "#E5E5E5"; // Default gray color
    if (score < 30) return "#F44336"; // Green for low score
    if (score < 70) return "#FFC107"; // Yellow for medium score
    return "#4CAF50"; // Red for high score
  };

  const chartData = [
    {
      name: "Clickbait Score",
      value: clickbaitScore ?? 0,
      fill: getBarColor(clickbaitScore),
    },
    {
      name: "Remaining",
      value: 100 - (clickbaitScore ?? 0),
      fill: "#F44336",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">ClickBait</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : clickbaitScore !== null ? (
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
              {clickbaitScore.toFixed(1)}%
            </h1>
            <p className="text-sm text-gray-400">ClickBait score</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">No data available</div>
      )}
    </div>
  );
};

export default ClickBait;
