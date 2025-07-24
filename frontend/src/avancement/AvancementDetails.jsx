import React, { useState, useEffect } from 'react';
import { FaChartLine, FaCalendarAlt, FaChalkboardTeacher, FaBook, FaUsers, FaCheckCircle, FaTimesCircle, FaClipboardCheck, FaSave, FaEdit } from 'react-icons/fa';
import "../style/AvancementDetails.css";
import { useDarkMode } from '../DarkModeProvider/DarkModeContext';
import { useParams } from 'react-router-dom';
import apiService from '../Axios/apiService';
import { Loader } from 'lucide-react';

const AvancementDetails = () => {
  // const [keyRunderComponenet ,setKeyRunderComponenet]=useState(1)
  const { darkMode } = useDarkMode();
  const { groupe, module } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avancement, setAvancement] = useState(null);
  const [nweHoures, setNweHoures] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [recommandedMh, setRecommandedMh] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // await apiService.getCsrfCookie();

        const response = await apiService.getAvancement(groupe, module);
        setAvancement(response.avancement);
        setNweHoures(response.avancement.nbh_par_semaine_total);
        console.log(response)
        if (response.recommandation !== 0) {
          setRecommandedMh(response.recommandation)
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Then set up polling

  }, [groupe, module]);


  const handlesouvgarder = async () => {

    if (!isNaN(nweHoures) && nweHoures !== 0) {
      try {
        await apiService.getCsrfCookie();
        await apiService.changeNbHeures({
          avancement: {
            code_module: module,
            code_groupe: groupe,
            matricule: avancement.matricule,
          },
          nbh_par_semaine: nweHoures,
        });

        // Fetch the updated data
        await apiService.getCsrfCookie();
        const response = await apiService.getAvancement(groupe, module);
        setAvancement(response.avancement);
        setNweHoures(response.avancement.nbh_par_semaine_total);

        setIsEditing(false);
        alert('Les heures ont été mises à jour avec succès.');
      } catch (err) {
        // setKeyRunderComponenet(prv =>prv +1) 
        setError(err.message || 'Erreur lors de la mise à jour des heures.');
      }
    }
  };




  // const handlesouvgarder = () => {
  //   if (!(isNaN(nweHoures) && nweHoures !== 0)) {
  //     setAvancement(prev => ({ ...prev, nbh_par_semaine_total: nweHoures }));
  //     setIsEditing(false);
  //     // Here you would typically call an API to save the changes
  //   }
  // };

  const handelModifier = () => {
    setIsEditing(true);
  };

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
        <span>Chargement de la page détail avancement ...</span>
      </div>
    );
  if (error) return <div className="avancement-container">Error: {error}</div>;
  if (!avancement) return <div className="avancement-container">No data found</div>;

  return (
    <div className="avancement-container">


      <div className={darkMode ? "top-section" : "top-section top-section-dark-mode-section"}>
        <h1 className="page-title color-all-text">Groupe : {avancement.code_groupe}</h1>

        <div className="stats-grid">
          {/* Module Information */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaBook />
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>Module</h3>
              <p className='color-all-text'>
                code: {avancement.code_module || 'Code non spécifié'}
              </p>
              <p className='color-all-text'>
                nom: {avancement.nom_module || 'Nom non spécifié'}
              </p>
            </div>
          </div>

          {/* Filière Information */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaChalkboardTeacher />
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>Filière</h3>
              <p className='color-all-text'>
                code: {avancement.code_filiere || 'Code non spécifié'}
              </p>
              <p className='color-all-text'>
                nom: {avancement.nom_filiere || 'Nom non spécifié'}
              </p>
            </div>
          </div>


          {/* Groupe Information */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>Groupe</h3>
              <p className='color-all-text'>{avancement.code_groupe || 'Not specified'}</p>
            </div>
          </div>

          {/* Contrôle Continue Information */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaClipboardCheck />
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>Contrôle continues réalisés</h3>
              <p className="highlight color-all-text">{avancement.nbcc_realisee}</p>
              {/* <p className="subtext color-all-text">Réalisé(s)</p> */}
            </div>
          </div>

          {/* Schedule Information */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>Schedule</h3>
              <p className='color-all-text'>
                date debut: {avancement.debut_module
                  ? new Date(avancement.debut_module).toLocaleDateString()
                  : 'No start date'}
              </p>
              <p className='color-all-text'>
                date fin: {avancement.fin_module
                  ? new Date(avancement.fin_module).toLocaleDateString()
                  : 'No end date'}
              </p>
            </div>
          </div>

          {/* Hours Information */}
          <div className="stat-card wide">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>Nombre d&apos;heures complétées</h3>
              <div className="hours-grid">
                <div>
                  <p className='color-all-text'>Nombre d&apos;heures par semaine</p>
                  <p className="highlight color-all-text">{avancement.nbh_par_semaine_total} h</p>
                </div>
                <div>
                  <p className='color-all-text'>Presentiel</p>
                  <p className="highlight color-all-text">{avancement.nbhp_realisee} h</p>
                </div>
                <div>
                  <p className='color-all-text'>À distance (Synchrone)</p>
                  <p className="highlight color-all-text">{avancement.nbhsync_realisee} h</p>
                </div>
                <div>
                  <p className='color-all-text'>Total</p>
                  <p className="highlight color-all-text">{avancement.nbh_total_realisee} h</p>
                </div>
              </div>
            </div>
          </div>

          {/* EFM Status */}
          <div className="stat-card">
            <div className="stat-icon">
              {avancement.efm_realise === "oui" ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <div className="stat-content">
              <h3 className='color-all-text'>EFM réalisé ?</h3>
              <p className={avancement.efm_realise === "oui" ? 'status-completed color-all-text' : 'status-pending color-all-text'}>
                {avancement.efm_realise === "oui" ? 'Oui' : 'Pas encore'}
              </p>
              {/* <p className="subtext color-all-text">CC: {avancement.nbcc_realisee}</p> */}
            </div>
          </div>

          {/* Hours Modification Section */}
          <div className={darkMode ? "hours-modification-section" : "hours-modification-section hours-modification-section-dark-mode"}>
            <h3 className='color-all-text'>Modifier Nombre d&apos;heures par semaine :</h3>
            <div className="hours-modification-controls">
              {isEditing ? (
                <>
                  <input
                    type="number"
                    value={nweHoures}
                    onChange={(e) => setNweHoures(Number(e.target.value))}
                    min="1"
                    className="hours-input"
                  />
                  <button className="btn-save-hours" onClick={handlesouvgarder}>
                    <FaSave /> Enregistrer
                  </button>
                </>
              ) : (
                <>
                  <span className="current-hours">{avancement.nbh_par_semaine_total} heures</span>
                  <button className="btn-modifier-hours" onClick={handelModifier}>
                    <FaEdit /> Modifier
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='test text-dark pt-4' style={{
            gridColumnStart: 3
          }}>
          {(recommandedMh && recommandedMh !== 0) ? <div className='alert alert-danger'>la masse horaire par semaine doit être au moins : {recommandedMh} heures</div> : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvancementDetails;