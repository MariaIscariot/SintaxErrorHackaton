"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Announcements = () => {
  interface Announcement {
    content: string;
    title: string;
    source: string;
    author: string;
    publish_date: string;
  }

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.post(
          "https://0411-93-113-114-106.ngrok-free.app/meta",
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
        console.log("API Response:", response.data); // Добавьте эту строку
        setAnnouncement(response.data);
      } catch (err: any) {
        console.error("Failed to fetch announcement:", err);
        setError(err.message || "Unable to load announcement. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchAnnouncement();
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

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-font font-semibold text-gray-700">Announcement</h1>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
          View All
        </span>
      </div>
 
      {/* Announcement Content */}
      <div className="flex flex-col gap-4 mt-4">
        {loading && <p className="text-sm text-gray-500">Loading announcement...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && !announcement && (
          <p className="text-sm text-gray-500">No announcement available.</p>
        )}
        {!loading && !error && announcement && (
          <div className={`rounded-md p-4 ${getBackgroundColor()} shadow-sm`}>
            <div className="flex items-start gap-4">
              <div>
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
                    Author: {announcement.author || "Unknown"} | Source:{" "}
                    {announcement.source || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
