// import { useState } from 'react';
// import './CircularProgress.css';
// import { useNavigate } from 'react-router-dom';

// import { useDarkMode } from "../DarkModeProvider/DarkModeContext";

// // Inside your component:

// const ProgressModules = () => {
//   const { darkMode } = useDarkMode();
//   const navigate = useNavigate();
//   const [progressData] = useState([
//     { id: 1, name: "filière 1", value: 9 },
//     { id: 2, name: "filière 2", value: 40 },
//     { id: 3, name: "filière 3", value: 55 }
//   ]);

//   const [showDetails, setShowDetails] = useState(false);

//   return (
//     <div  className={darkMode?"progress-container":"progress-container progress-container-dark-mode-progers"}>
//       {/* <h2 className="progress-title">Progrès des modules</h2> */}

//       {progressData.map((filiere) => (
//         <div key={filiere.id} className="progress-item">
//           <div className="progress-header">
//             <span>{filiere.name} :</span>
//             <span>{filiere.value}%</span>
//           </div>
//           <svg className="progress-bar">
//             <rect className="progress-bar-bg" width="100%" height="6" rx="5" ry="5" />
//             <rect
//               className={`progress-bar-fill ${filiere.value > 50 ? 'high' : 'low'}`}
//               width={`${filiere.value}%`}
//               height="6"
//               rx="5"
//               ry="5"
//             />
//           </svg>
//         </div>
//       ))}

//       {/* Button at bottom-right inside progress-container */}
//       <div className="button-container">
//         {/* <button className="details-button" onck onClick={() => setShowDetails(!showDetails)}> */}
//         <button className="details-button" onClick={()=>navigate("/app/avencementFiliere")}>
//           Détails {showDetails ? '>>' : '>>'}
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ProgressModules;

import { useEffect, useState } from 'react';
import './Progressbars.css';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
import apiService from '../Axios/apiService'; // adjust the path if needed
import { Loader } from 'lucide-react';

const ProgressModules = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvancement = async () => {
      try {
        setLoading(true);
        await apiService.getCsrfCookie(); // If using Laravel Sanctum

        const data = await apiService.getFilieresAvonment();
        setProgressData(data);
        console.log("data:",data)
      } catch (err) {
        console.error("Erreur lors du chargement de l'avancement :", err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvancement();
  }, []);
  if (loading)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // height: "100vh", // Full height center
        flexDirection: "column",
        gap: "1rem",
        fontSize: "1.2rem",
        color: "#555",
      }}
    >
      <Loader className="animate-spin" size={24} />
      <span>Chargement des filières...</span>
    </div>
  );
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className={darkMode ? "progress-container" : "progress-container progress-container-dark-mode-progers"}>
      {loading && <p>Chargement en cours...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && progressData.map((filiere, index) => (
        <div key={index} className="progress-item">
          <div className="progress-header">
            <span>{filiere.code_filiere} :</span>
            <span>{Math.round(filiere.taux_avancement)}%</span>
          </div>
          <svg className="progress-bar">
            <rect className="progress-bar-bg" width="100%" height="6" rx="5" ry="5" />
            <rect
              className={`progress-bar-fill ${filiere.taux_avancement > 50 ? 'high' : 'low'}`}
              width={`${Math.min(filiere.taux_avancement, 100)}%`}
              height="6"
              rx="5"
              ry="5"
            />
          </svg>
        </div>
      ))}

      <div className="button-container">
        <button className="details-button" onClick={() => navigate("/app/avencementFiliere")}>
          Détails {">>"}
        </button>
      </div>
    </div>
  );
};

export default ProgressModules;
