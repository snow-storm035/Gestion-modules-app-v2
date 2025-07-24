import { useEffect, useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axiosClient from "../Axios/axios";
import { appContext } from "../context/globalcontext";

const RequireAuth = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();


  const {setAuthUser} = useContext(appContext)

  useEffect(() => {
    axiosClient.get("/api/user")
      .then((response) => {
        setIsAuthenticated(true);
        console.log('from auth file : ', response)
        setAuthUser(prev => ({...prev, ...response.data}))

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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth; 