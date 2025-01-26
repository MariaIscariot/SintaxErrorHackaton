// "use client";
// import { useEffect } from "react";
// import axios from "axios";

// const TestApi = () => {
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           process.env.NEXT_PUBLIC_API_URL || "https://0411-93-113-114-106.ngrok-free.app:8000/"
//         );
//         console.log("Ответ от API:", response.data);
//       } catch (error) {
//         console.error("Ошибка API:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return <div>Проверка API запроса, смотри консоль!</div>;
// };

// export default TestApi;