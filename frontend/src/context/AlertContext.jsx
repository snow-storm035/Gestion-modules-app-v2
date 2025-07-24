import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from "../Axios/apiService"; // adjust path

export const AlertContext = createContext();

// export const AlertProvider = ({ children }) => {




//   return (
//     <AlertContext.Provider value={{ notification2,setNotification2,setLoading,setError, loading, error }}>
//       {children}
//     </AlertContext.Provider>
//   );
// };

// export const useAlertContext = () => useContext(AlertContext);
