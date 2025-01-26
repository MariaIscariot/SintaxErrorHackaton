"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const List = () => {
  interface Announcement {
    content: string | null;
    title: string;
    // author: string| null;
    source: string;
    author: string;
    publish_date: string;
    diagram_title: string;
    diagram_value: number;
   
  }

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.post(
          "https://0411-93-113-114-106.ngrok-free.app/rec_one",
          {
            news_url: "https://moldova.europalibera.org/a/trump-si-a-pus-in-miscare-tavalugul-conservator-zeci-de-ordine-executive-impotriva-imigratiei-diversitatii-sau-protectiei-mediului/33283154.html",
            lang: "ron",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        console.log("API Response:", response.data);
        setAnnouncements(response.data as Announcement[]); // Set the fetched data to state
      } catch (err: any) {
        console.error("Failed to fetch announcements:", err);
        setError(err.message || "Unable to load announcements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getBackgroundColor = () => "bg-blue-100";

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Invalid date";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCircleDiagram = (value: number, title: string) => {
    const percentage = Math.min(Math.max(value * 100, 0), 100); // Ограничиваем значение между 0 и 100
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col h-[125px] items-center mt-2">
        <div className="relative">
          <svg width="50" height="50" className="rotate-90">
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="#e3e3e3"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="#4CAF50"
              strokeWidth="4"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.35s" }}
            />
          </svg>
          {/* Заголовок внутри круга */}
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-700 font-medium">
            {title}
          </div>
        </div>
        {/* Процент ниже круга */}
        <span className="mt-2 text-sm font-semibold text-gray-600">
          {`${percentage.toFixed(0)}%`}
        </span>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className={`rounded-md p-4 ${getBackgroundColor()} shadow-sm flex justify-between items-start`}
            >
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-700">
                    {announcement.title || "No Title"}
                  </h2>
                  <span className="text-xs text-gray-500 bg-white rounded-md px-2 py-1">
                    {formatDate(announcement.publish_date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {announcement.content || "No content available."}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">
                    Author: {announcement.author || "Unknown"} | List:{" "}
                    {announcement.source || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                {renderCircleDiagram(announcement.diagram_value, announcement.diagram_title)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
