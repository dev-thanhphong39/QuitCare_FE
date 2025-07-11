import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"; // Thêm Outlet
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import BlogPage from "./components/blog/Blog";
import RankingPage from "./components/ranking/Ranking";
import BookingPage from "./pages/Booking";
import PlanPage from "./components/planing/Planning";
import BackToTopButton from "./components/back-to-top/BackToTopButton";
import BlogDetail from "./components/blog/BlogDetail";
import Profile from "./components/profile/profile";
import Dashboard from "./components/dashboard/dashboard";
import SuggestPlaning from "./components/planing/SuggestPlaning";
import CreatePlanning from "./components/planing/CreatePlanning";
import ViewSurvey from "./components/viewsurvey/ViewSurvey";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import UserManagement from "./pages/dashboard-staff/user";
import CommentManagement from "./pages/dashboard-staff/comment";
import RevenueManagement from "./pages/dashboard-staff/revenue";
import PackagesManagement from "./pages/dashboard-staff/packages";
import FeedbackManagement from "./pages/dashboard-staff/feedback";
import PostsManagement from "./pages/dashboard-staff/posts";
import Tracking from "./pages/Tracking";
import NotificationPage from "./components/notificate/NotificationPage";
import ForgotPasswordForm from "./components/forgot-password/forgot-pasword";
import PaymentPage from "./components/payment/submitOrder";
import PaymentResult from "./components/payment/PaymentResult";

import CoachDashboard from "./components/dashboard/coach-dashboard";
import WorkScheduleManagement from "./pages/dashboard-coach/register/management-schedule";
import AdviseUser from "./pages/dashboard-coach/calendar/advise-user";
import ViewAdvise from "./components/view-advise/ViewAdvise";
import HistoryPayment from "./components/payment/PaymentHistory";

// Import các component cần thiết
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

// Tạo Layout chung
const AppLayout = () => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <ScrollToTop />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />, // <-- Sử dụng Layout chung làm route cha
      children: [
        // <-- Tất cả các trang đều là con của AppLayout
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
        },
        {
          path: "/noti",
          element: <NotificationPage />,
        },
        {
          path: "/blog/:id",
          element: <BlogDetail />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/viewsurvey",
          element: <ViewSurvey />,
        },
        {
          path: "/viewadvise",
          element: <ViewAdvise />,
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
          path: "/dashboard-coach",
          element: <CoachDashboard />,
          children: [
            {
              path: "register",
              element: <WorkScheduleManagement />,
            },
            {
              path: "calendar",
              element: <AdviseUser />,
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
        {
          path: "/history-transactions",
          element: <HistoryPayment />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPasswordForm />,
        },
        {
          path: "/payment",
          element: <PaymentPage />,
        },
        {
          path: "/payment-result",
          element: <PaymentResult />,
        },
        {
          path: "/payment-success",
          element: <PaymentResult />,
        },
        {
          path: "/payment-fail",
          element: <PaymentResult />,
        },
      ],
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
