import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { admin, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!admin) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }
  return children;
}


