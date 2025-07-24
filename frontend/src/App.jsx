// import { useState } from 'react'
import { RouterProvider } from "react-router-dom";
import './App.css'
import { router } from "./router/router";
import { AlertContext } from './context/AlertContext'; // adjust path
// import { AlertProvider } from './context/lmAlertContext'; // adjust path
import { useEffect, useState, useMemo } from "react";
import apiService from "./Axios/apiService";
import { appContext } from "./context/globalcontext";
function App() {
  // const [count, setCount] = useState(0)

  const [notification2, setNotification2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authUser, setAuthUser] = useState(null)
  // Fetch CSRF cookie globally on app mount
  useEffect(() => {
    apiService.getCsrfCookie();
    console.log('hi! i am console')
    apiService.getUser()
  }, []);

  useEffect(() => {
    const fetchAlertCounts = async () => {
      try {
        setLoading(true);
        // await apiService.getCsrfCookie(); // This line is now redundant as it's handled globally

        const [notification2] = await Promise.all([
          apiService.getNotifications(),
        ]);

        setNotification2(notification2 || []);
      } catch (err) {
        console.error('Erreur lors du chargement des alertes :', err);
        setError('Erreur lors du chargement des alertes.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlertCounts();
  }, []);

  const contextValue = useMemo(() => ({
    notification2,
    setNotification2,
    setLoading,
    setError,
    loading,
    error
  }), [notification2, loading, error]);

  const data = useMemo(() => ({setAuthUser, authUser}), [authUser])

  return (
    <>
      <appContext.Provider value={data}>
        <AlertContext.Provider value={contextValue}>
          <RouterProvider router={router} />
        </AlertContext.Provider>
      </appContext.Provider>
    </>
  )
}

export default App


// import { AlertProvider } from './contexts/AlertContext'; // adjust path

// function App() {
//   return (
//     <AlertProvider>
//       {/* your app structure */}
//     </AlertProvider>
//   );
// }
