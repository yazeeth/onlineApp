import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <div>
      <h2 className="text-3xl font-semibold">Welcome to OnlineShop</h2>
      <p className="mt-2 text-gray-600">
        Your modern e-commerce platform.
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export default router;