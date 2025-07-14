import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/unauthorized",
}) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  // Nếu chưa đăng nhập
  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role có được phép truy cập không
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
