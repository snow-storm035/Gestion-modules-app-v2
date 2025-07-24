import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axiosClient from "../Axios/axios";

const RequireNotAuth = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    axiosClient.get("/api/user")
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((error) => {
        setIsAuthenticated(false);
        // Log error for debugging
        console.error("Auth check failed:", error?.response?.status, error?.response?.data);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/app" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireNotAuth; 