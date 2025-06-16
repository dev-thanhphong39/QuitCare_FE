import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

const CLIENT_ID = "20979810031-rfhiaih6d7ha5kmug9t2nh482pj1sano.apps.googleusercontent.com"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
      <ToastContainer />
    </GoogleOAuthProvider>
  </StrictMode>
);
