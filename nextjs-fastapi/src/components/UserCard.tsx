import axios from "axios";
import Image from "next/image";

// Axios client for interacting with the FastAPI backend
// const apiClient = axios.create({
//   baseURL: "https://0411-93-113-114-106.ngrok-free.app", // URL of your FastAPI backend
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// UserCard Component
const UserCard = ({ type }: { type: string }) => {
  // Capitalize and pluralize the type
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const pluralize = (str: string) => (str.endsWith("s") ? str : `${str}s`);

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="More options" width={20} height={20} />
      </div>

      {/* Data Section */}
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">
        {capitalize(pluralize(type))}
      </h2>
    </div>
  );
};

// // Fetch items from the backend
// export const fetchItems = async () => {
//   try {
//     const response = await apiClient.get("/items");
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch items:", error);
//     throw error; // Rethrow the error for the caller to handle
//   }
// };

export default UserCard;