import List from "@/components/List";
import CountChart from "@/components/CountChart";
import ClickBait from "@/components/ClickBait";
import Source from "@/components/Source";
import Announcements from "@/components/Announcements";
import EmotionChart from "@/components/EmotionChart";
import Fake from "@/components/Fake";
import axios from "axios";

// Axios client for interacting with the FastAPI backend
const apiClient = axios.create({
  baseURL: "https://0411-93-113-114-106.ngrok-free.app", 
  // URL of your FastAPI backend
});
const fetchItems = async () => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch items from API:", error);
    return null; // Handle errors gracefully
  }
};

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row bg-gray-50">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* BIG ANNOUNCEMENT */}
        <div className="w-full shadow-lg rounded-2xl bg-white">
          <Announcements />
        </div>

        <div className="flex gap-8 justify-between">
          <div className="w-full lg:w-1/3 h-[400px] shadow-lg rounded-2xl bg-white">
            <ClickBait />
          </div>
          <div className="w-full lg:w-1/3 h-[400px] shadow-lg rounded-2xl bg-white">
            <CountChart />
          </div>
          <div className="w-full lg:w-1/3 h-[400px] shadow-lg rounded-2xl bg-white">
            <Fake />
          </div>
        </div>

        {/* LINEAR CHART */}
        <div className="w-full h-[300px] shadow-lg rounded-2xl bg-white">
          <List />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        {/* ATTENDANCE CHART */}
        <div className="h-[450px] shadow-lg rounded-2xl bg-white">
          <EmotionChart />
        </div>

        {/* RECTANGULAR ANNOUNCEMENT */}
        <div className="w-full h-[350px] shadow-lg rounded-2xl bg-white">
          <Source />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
