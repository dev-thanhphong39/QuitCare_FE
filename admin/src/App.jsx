import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import BlogPage from "./components/blog/Blog";
import RankingPage from "./components/ranking/Ranking";
import BookingPage from "./pages/Booking";
import PlanPage from "./components/planing/Planning";
import BackToTopButton from "./components/back-to-top/BackToTopButton";
import BlogDetail from "./components/blog/BlogDetail";
import Dashboard from "./components/dashboard/dashboard";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";


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
      path: "/planning",
      element: <PlanPage />,
    },
    {
      path: "/booking",
      element: <BookingPage />,
    },
    {
      path: "/blog/:id",
      element: <BlogDetail />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
        <BackToTopButton />
      </Provider>
    </>
  );
}

export default App;
