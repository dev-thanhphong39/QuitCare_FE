import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import BlogPage from "./components/blog/Blog";
import RankingPage from "./components/ranking/Ranking";
import BookingPage from "./components/bookings/Booking";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/blog",
      element: <BlogPage />,
    },
    {
      path: "/ranking",
      element: <RankingPage />,
    },
    {
      path: "/booking",
      element: <BookingPage />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
