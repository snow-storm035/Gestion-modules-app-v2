import React, { useState } from 'react';
import '../style/UpdateModuleStatu.css';

const UpdateModuleStatu = () => {
 
  const [moduleData, setModuleData] = useState({
    id: 10,
    groupe: { code: 'GRP10', nom: 'Groupe J', annee_formation: '2024-2025' },
    module: { code: 'M310', nom: 'Docker & Kubernetes' },
    regional: "oui",
    date_fin_prevu: '2024-11-01',
    date_efm_reelle: '2024-10-25',
    mh_restante: 50,
    etat: 'retard',
    mh_minimum_recommande: 15,
    heures_par_semaine: 3
  });

  const [newHours, setNewHours] = useState(moduleData.heures_par_semaine);
  const [message, setMessage] = useState('');

  const handleHoursChange = (e) => {
    const value = parseInt(e.target.value);
    setNewHours(isNaN(value) ? 0 : value);
  };

  const updateWeeklyHours = () => {
    if (newHours <= 0) {
      setMessage('Le nombre d\'heures doit être supérieur à 0');
      return;
    }

    setModuleData(prev => ({
      ...prev,
      heures_par_semaine: newHours
    }));

    setMessage(`Mise à jour réussie : ${newHours}h/semaine`);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="module-status-container">
      <h2>Modifier nombre d'heures par semaine:</h2>
      
      <div className="module-info-grid">

        <div className="info-row">
          <span className="info-label">Groupe :</span>
          <span className="info-value">{moduleData.groupe.code}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Module :</span>
          <span className="info-value">{moduleData.module.code}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Régionale:</span>
          <span className="info-value">{moduleData.regional}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Date fin prévue:</span>
          <span className="info-value">{moduleData.date_fin_prevu}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Date EFM réelle:</span>
          <span className="info-value">{moduleData.date_efm_reelle}</span>
        </div>
        <div className="info-row">
          <span className="info-label">MH restante:</span>
          <span className="info-value">{moduleData.mh_restante}h</span>
        </div>
        <div className="info-row">
          <span className="info-label">État:</span>
          <span className={`info-value status-${moduleData.etat}`}>
            {moduleData.etat.charAt(0).toUpperCase() + moduleData.etat.slice(1)}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">MH minimum recommandé:</span>
          <span className="info-value">{moduleData.mh_minimum_recommande}h</span>
        </div>
        <div className="info-row">
          <span className="info-label">Heures par semaine:</span>
          <span className="info-value">{moduleData.heures_par_semaine}h</span>
        </div>
      </div>
      
      <div className="validation-section">
        <div className="hours-input">
          <label htmlFor="weekly-hours">Nombre d'heures par semaine:</label>
          <input 
            type="number" 
            id="weekly-hours" 
            min="1" 
            value={newHours}
            onChange={handleHoursChange}
          />
        </div>
        <button className="validate-btn" onClick={updateWeeklyHours}>
          Valider
        </button>
        {message && (
          <div className={`message ${message.includes('réussie') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateModuleStatu;