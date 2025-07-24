// src/components/Layout.js
import { NavLink, Outlet } from "react-router-dom";
import "./styleLayout.css";
import LogoOfppt from "../image/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCodeBranch, faBook, faUserGroup, faCalendar, faCircleExclamation, faBell, faCircleXmark, faTrash, faFile } from '@fortawesome/free-solid-svg-icons';
import Logout from "./Logout";
import DarkMode from "./DarkMode";
import { useDarkMode } from '../DarkModeProvider/DarkModeContext';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import apiService from "../Axios/apiService"
import { AlertContext } from "../context/AlertContext";
import { appContext } from "../context/globalcontext";
import apiService from "../Axios/apiService";
import { Loader } from "lucide-react";
const Layout = () => {

  const { authUser } = useContext(appContext)

  const [openTrue, setOpenTrue] = useState(true);
  const navigate = useNavigate();

  const [heddin, setHeddin] = useState(true)
  const [extanded, setExtanded] = useState("");
  // const [notification2, setNotification2] = useState([]);
  const { notification2, loading, setNotification2 } = useContext(AlertContext);
  const [showTruncateModal, setShowTruncateModal] = useState(false);
  const [truncateLoading, setTruncateLoading] = useState(false);
  const [truncateError, setTruncateError] = useState(null);

  const handleTruncateClick = () => {
    setShowTruncateModal(true);
    setTruncateError(null);
  };

  const handleTruncateCancel = () => {
    setShowTruncateModal(false);
    setTruncateError(null);
  };

  const handleTruncateConfirm = async () => {
    setShowTruncateModal(false); // Close modal immediately
    setTruncateLoading(true);
    setTruncateError(null);
    try {
      await apiService.truncateCustomTables();
    } catch {
      setTruncateError('Erreur lors de la suppression des données.');
    } finally {
      setTruncateLoading(false);
    }
  };


  const hendelsetOpenTrue = () => {
    if (openTrue) {
      setOpenTrue(false);
      setExtanded("extanded")
    } else {
      setOpenTrue(true);
      setExtanded("")
    }
  }

  const hideNotifcation = () => {
    if (heddin == true) {
      setTimeout(() => {
        setHeddin(false)
      }, 3000)
    }
  }
  useEffect(() => {
    const getNotifications = async () => {
      await apiService.getCsrfCookie();
      const [notification2] = await Promise.all([
        apiService.getNotifications(),
      ]);

      setNotification2(notification2 || []);
    }
    getNotifications()
    hideNotifcation()
    // console.log("response notificatoun layout:", notification2)
  }, [])
  const handelHeddin = () => {
    if (heddin == true) {
      setHeddin(false)
    } else {
      setHeddin(true)
    }



  }




  const handleClick = () => {
    handelHeddin();
    navigate("/app/alerts")

  }
  // handel function heddin alert

  const handleheddinalert = () => {
    setNotification2((prv) => ({ ...prv, notification: false }))
  }
  const { darkMode } = useDarkMode();


  // onClick={toggleDarkMode}
  // className="darkmode"
  // aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}

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
        <span>Chargement de layout...</span>
      </div>
    );
  // if (error) return <div>Error: {error}</div>;
  return (
    <div className="countiner">
      <div className="btn_hedden_menu">
        <button onClick={hendelsetOpenTrue}>   {openTrue ? '>' : '<'} </button>
      </div>
      {openTrue &&
        <div className="menu">

          {/* logo this is page dashbord  */}
          <div className="logo">
            <img src={LogoOfppt} alt="Office OFPPT" /> {/* Logo added */}
            <h2>Dashboard</h2>
          </div>
          {/* navbur  */}
          <div className="navbar">
            <nav>
              <ul>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app"> <FontAwesomeIcon className="icon-fontawesome" icon={faHouse} />Acceuil</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app/etatmodel"><FontAwesomeIcon className="icon-fontawesome" icon={faBook} />États modules</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app/calendrierEfm"><FontAwesomeIcon className="icon-fontawesome" icon={faCalendar} />Calendrier EFMs</NavLink></li>
                <li className="avancements-nav">Avancements</li>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app/avancemnetGroup"><FontAwesomeIcon className="icon-fontawesome" icon={faUserGroup} />Groupes</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app/avencementFiliere"><FontAwesomeIcon className="icon-fontawesome" icon={faCodeBranch} />Filières</NavLink></li>
                <div className="div-hr">

                </div>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app/alerts"><FontAwesomeIcon className="icon-fontawesome" icon={faCircleExclamation} />Alerts</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "link_dashbord active-link" : "link_dashbord"} to="/app/importerfichierexcel"><FontAwesomeIcon className="icon-fontawesome" icon={faFile} />Importer Excel</NavLink></li>

                {/* <li>
                <button
                  className="link_dashbord"
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 'inherit' }}
                  onClick={async () => {
                    try {
                      const result = await apiService.checkProgressState();
                      alert('Résultat: ' + (typeof result === 'object' ? JSON.stringify(result) : result));
                    } catch (err) {
                      alert('Erreur: ' + (typeof err === 'object' ? JSON.stringify(err) : err));
                    }
                  }}
                >
                  <FontAwesomeIcon className="icon-fontawesome" icon={faBook} />Vérifier Avancement
                </button>
              </li> */}

              </ul>

            </nav>

          </div>

          {/* dark mode and logout => deconection  */}

          <div className="darkModeAndlogout">
            {/* Truncate Button */}
            {
              (authUser.role === "admin" ?
                <button
                  style={{
                    background: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 16px',
                    marginBottom: '0px',
                    width: '100%',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(211,47,47,0.08)'
                  }}
                  onClick={handleTruncateClick}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Vider la base (danger)
                </button>
                : '')
            }
            <Logout />
            <DarkMode />
          </div>


        </div>
      }
      {/* content  */}
      <div className={darkMode ? `contenu ${extanded}` : `contenu ${extanded} contenuDarkblack`}>

        <Outlet />
      </div>


      {/* {notification2.notifications.length > 0 && (
  <div>
    <p>Module: {notification2.notifications[0].data.code_module}</p>
    <p>Groupe: {notification2.notifications[0].data.code_groupe}</p>
  </div>
)} */}
      {/* etat */}

      {/* {console.log(notification2)} */}
      {
        notification2?.notifications?.length > 0 ?
          <div className="alert-bubble">
            {heddin && notification2?.notifications?.length > 0 ?
              <div className="alert-message-bubble">
                <button className="close_btn" onClick={handelHeddin}>
                  <FontAwesomeIcon className="fa-regular fa-circle-xmark" icon={faCircleXmark} />
                </button>
                <p className="alert-text">le group <b>{notification2.notifications[0].data.code_groupe}</b> est <b>{notification2.notifications[0].data.etat}</b> dans le module <b>{notification2.notifications[0].data.code_module}</b>.
                  <span>
                    <a
                      className="btn-alert-details"
                      href={`/app/avancementDetail/${notification2.notifications[0].data.code_groupe}/${notification2.notifications[0].data.code_module}`}
                      onClick={handleheddinalert}
                    >
                      Voir détails
                    </a>
                  </span>
                </p>

              </div >
              :
              ""
            }
            <button className="btn-bubble" onClick={handleClick} >
              <div className="alert-icon">
                <div>
                  <span className="alert-number"> {notification2.unread_count || 0} </span>
                  <FontAwesomeIcon className="faBell" icon={faBell} />
                </div>

              </div>

            </button>
          </div>
          :
          ""
      }
      {/* Truncate Modal */}
      {showTruncateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 4px 32px rgba(211,47,47,0.25)',
            border: '2px solid #d32f2f',
            minWidth: '340px',
            maxWidth: '90vw',
            textAlign: 'center',
            color: '#d32f2f',
            fontWeight: 'bold',
            position: 'relative'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
            <div style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              Cette action supprimera <b>toutes les données personnalisées</b> (hors utilisateurs et tables système Laravel).<br />
              Êtes-vous sûr de vouloir continuer ?
            </div>
            {truncateError && <div style={{ color: '#b71c1c', marginBottom: '1rem' }}>{truncateError}</div>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={handleTruncateConfirm}
                style={{
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  cursor: truncateLoading ? 'not-allowed' : 'pointer',
                  opacity: truncateLoading ? 0.7 : 1
                }}
                disabled={truncateLoading}
              >
                {truncateLoading ? 'Suppression...' : 'OK'}
              </button>
              <button
                onClick={handleTruncateCancel}
                style={{
                  background: 'white',
                  color: '#d32f2f',
                  border: '2px solid #d32f2f',
                  borderRadius: '4px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Layout;