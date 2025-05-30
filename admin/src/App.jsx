import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
<<<<<<< Updated upstream
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Blog from "./pages/Blog";
import Footer from "./components/footer/Footer";
=======
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

import BlogPage from "./components/blog/Blog";
import RankingPage from "./components/ranking/Ranking";
import MembersPage from "./components/members/Members";

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      element: <Blog />,
=======
      element: <BlogPage />,
    },
    {
      path: "/ranking",
      element: <RankingPage />,
    },
    {
      path: "/members",
      element: <MembersPage />,
>>>>>>> Stashed changes
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
<<<<<<< Updated upstream
      <Footer />
=======
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
