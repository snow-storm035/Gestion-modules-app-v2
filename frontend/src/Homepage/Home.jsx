import "../style/styleHome2.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faGreaterThan, faBook, faCodeBranch ,faUserGroup} from '@fortawesome/free-solid-svg-icons';
// import CircularProgress from "../CircularProgress/CircularProgress";
import downloadImage from "../image/download.png";
import ProgressModules from "../Progressbars/Progressbars";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
import apiService from '../Axios/apiService';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

// const response = await apiService.getCalendrierEfms();
// // console.log("response:", response)
// setCalendrierEfms(response.calendrierEfms || []);
export default function Home() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [presqueFinisCount, setPresqueFinisCount] = useState(0);
  const [retardCount, setRetardCount] = useState(0);
  const [numberGroup, setNumberGroup] = useState(0);
  const [numberFiliere, setNumberFiliere] = useState(0);
  const [notification, setNotification] = useState([]);
  const [calendrierEfms, setCalendrierEfms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    const fetchAlertCounts = async () => {
      try {
        setLoading(true); // optional, if you track global loading
        await apiService.getCsrfCookie(); // Laravel Sanctum support
        console.log('hi! i am console')

        const [presque, retard, numberGroup, numberFiliere, notification, calendrierEfms1] = await Promise.all([
          apiService.getAlertsCountpresquefinie(),
          apiService.getAlertsCountretard(),
          apiService.getGroupesCount(),
          apiService.getFilieresCount(),
          apiService.getNotifications(),
          apiService.getCalendrierEfms(),
        ]);

        setPresqueFinisCount(presque.alerts_count || 0);
        setRetardCount(retard.alerts_count || 0);
        setNumberGroup(numberGroup.nbrgroupes || 0);
        setNumberFiliere(numberFiliere.nbrfilieres || 0);
        setNotification(notification || []);
        setCalendrierEfms(calendrierEfms1.calendrierEfms || []);;
      } catch (err) {
        console.error("Erreur lors du chargement des alertes :", err);
        setError("Erreur lors du chargement des alertes."); // optional
      } finally {
        setLoading(false);
      }
    };

    fetchAlertCounts();
  }, []);
  
  
useEffect(()=>{
  console.log("presqueFinisCount:",presqueFinisCount)
  console.log("presqueFinisCount:",retardCount)
  console.log("notification:",notification)
},[presqueFinisCount,retardCount,notification])
if (loading)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full height center
        flexDirection: "column",
        gap: "1rem",
        fontSize: "1.2rem",
        color: "#555",
      }}
    >
      <Loader className="animate-spin" size={48} />
      <span>Chargement de la page d’accueil...</span>
    </div>
  );
 
// if (error) return <div>Error: {error}</div>;

  return <>
    <div className="articl-dates-card-section-header-all-div">

      {/* four div about number moudil and goroub and professoure  */}
      <div className="section-header">

        <div className="header">
          <div onClick={() => navigate('avencementFiliere')} className="square-data-buttons">
            <span>{numberFiliere}</span>
            <FontAwesomeIcon className="faCodeBranch" icon={faCodeBranch} />
            <FontAwesomeIcon className="faGreaterThan" icon={faGreaterThan} />
          </div>
          <div onClick={() => navigate('avancemnetGroup')} className="square-data-buttons">
            <span>{numberGroup}</span>

            <FontAwesomeIcon className="faUserGroup" icon={faUserGroup} />
            <FontAwesomeIcon className="faGreaterThan" icon={faGreaterThan} />
          </div>


        </div>
        <div className="informtionCountner">
          <div className="aside">
            <div className={darkMode ? "alert-container" : "alert-container alert-container-dark-mode"}>

              {/* <div className="button-container"> */}
              <button className="status-button presque-finis " onClick={() => navigate("/app/alerts?etat=presque fini")}>
                <span className="count">{presqueFinisCount}</span>
                <span className="label">Modules presque finis</span>
              </button>

              <button className="status-button en-retards" onClick={() => navigate("/app/alerts?etat=en retard")}>
                <span className="count">{retardCount}</span>
                <span className="label">Modules en retard</span>
              </button>
              {/* </div> */}
            </div>
            <div className={darkMode ? "module-progress-card" : "module-progress-card module-progress-card-dark"}>

              <h2 className="module-progress-title">Progès des filière</h2>

              <ProgressModules />
            </div>

            <div className={darkMode ? "completed-modules-container" : "completed-modules-container completed-modules-container-dark"}>
              <p>États modules</p>
              <button className="navigation-button details-button-date" onClick={() => navigate("/app/etatmodel")}>
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* this parter exest tow div asise and articl */}


      <div className="articl-dates-card">
        <div className="dates-efms-card article">

          <h3 className="dates-efms-title">DATES EFMS</h3>

          <ul className="module-dates-list">
            {calendrierEfms.slice(0, 8).map((item, index) => (
              <li key={index} className="module-date-item">
                <span className="module-code">{item.code_groupe}&gt;{item.code_module}</span>
                <span className="module-date">
                  {item.date_efm_prevu
                    ? new Date(item.date_efm_prevu).toLocaleDateString()
                    : 'Date non prévue'}
                </span>
              </li>
            ))}

          </ul>

          <button className="view-details-btn details-button-date" onClick={() => navigate("/app/calendrierEfm")}>
            Détails {">>"}
          </button>
        </div>
        <a href="app/importerfichierexcel" className="link-go-page-avoncemnt">
          <div className="import-file-exele-avoncement">
            <img src={downloadImage} alt="download" className="image-download" />
            <p>
              Importer les données
            </p>
          </div>
        </a>
      </div>
      {/* </div> */}
    </div>
  </>
}