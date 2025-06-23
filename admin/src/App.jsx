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
import EditProfile from "./components/edit-profile/edit-profile";
import Dashboard from "./components/dashboard/dashboard";
import SuggestPlaning from "./components/planing/SuggestPlaning";
import CreatePlanning from "./components/planing/CreatePlanning";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import UserManagement from "./pages/dashboard-admin/user";
import CommentManagement from "./pages/dashboard-admin/comment";
import RevenueManagement from "./pages/dashboard-admin/revenue";
import PackagesManagement from "./pages/dashboard-admin/packages";
import FeedbackManagement from "./pages/dashboard-admin/feedback";
import PostsManagement from "./pages/dashboard-admin/posts";
import Tracking from "./pages/Tracking";
import NotificationPage from "./components/notificate/NotificationPage";

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
      path: "/tracking",
      element: <Tracking />,
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
    },
    {
      path: "/noti",
      element: <NotificationPage />,
=======
>>>>>>> b88ec7dc0b1ad2b60fa2b90288af4466ca1c19c1
>>>>>>> Stashed changes
    },
    {
      path: "/blog/:id",
      element: <BlogDetail />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "users",
          element: <UserManagement />,
        },
        {
          path: "comments",
          element: <CommentManagement />,
        },
        {
          path: "revenue",
          element: <RevenueManagement />,
        },
        {
          path: "feedback",
          element: <FeedbackManagement />,
        },
        {
          path: "packages",
          element: <PackagesManagement />,
        },
        {
          path: "posts",
          element: <PostsManagement />,
        },
      ],
    },
    {
      path: "/suggest-planing",
      element: <SuggestPlaning />,
    },
    {
      path: "/create-planning",
      element: <CreatePlanning />,
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
