import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/DetailsAvencemnet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
const DetailsAvencemnet = () => {
    const [openModifier, setOpenModifier] = useState(true)

    const handelModifier = () => {
        setOpenModifier(false)
    }
    const [GroupDet, setGroupDet] = useState({
        id: 10,
        groupe: {
            code: 'GRP10',
            nom: 'Groupe J',
            annee_formation: '2024-2025'
        },
        module: {
            code: 'M310',
            nom: 'Docker & Kubernetes'
        },
        filière: {
            code: 'FIL109',
            nom: 'Gestion de Projet'
        },
        nbh_par_semaine_realisee: 3,
        efm_realise: false,
        date_debut: '2025/03/01',
        date_fin: null,
        nbhp_realisee: 50,
        nbhsync_realisee: 10,
        nbh_total_realisee: 60,
        recommandation: 5,
        contrôle_continue_réalisé: 1,
        masse_horaire: {
            présentielle: 90,
            synchrone: 30,
            totale: 120
        }
    })

    const [nweHoures, setNweHoures] = useState(GroupDet.nbh_par_semaine_realisee);
    const handlesouvgarder = () => {
        if (!(isNaN(nweHoures) && nweHoures == 0)) {
            setGroupDet((prv) => ({ ...prv, nbh_par_semaine_realisee: nweHoures }))
        }
        setOpenModifier(true)
    }

    // const [hoursPerWeek, setHoursPerWeek] = useState(5);

    return (
        <>
            <div className="group-hours-container">
                {((GroupDet.recommandation !== null) &&( GroupDet.recommandation>=GroupDet.nbh_par_semaine_realisee))?
                    
                    <div className="section-header-recommandation">
                    <h3> mh minimum recommandé : <span>{GroupDet.recommandation}h</span></h3>

                   </div>
                    :
                    ""
                }


                <div className="section">
                    <h1>Groupe : {GroupDet.groupe.code}</h1>


                </div>
                <div className="section">
                    <h3>filière : :</h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.filière.nom}</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Module : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.module.nom}</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Masse horaire présentielle : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.masse_horaire.présentielle}h</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Masse horaire synchrone : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.masse_horaire.synchrone}h</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Masse horaire présentielle réalisée : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.nbhp_realisee}h</strong></div>

                    </div>
                </div>
                <div className="section">
                    <h3>Masse horaire synchrone réalisée : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.nbhsync_realisee}h</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Masse horaire total réalisée : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.nbh_total_realisee}h</strong></div>
                    </div>
                </div>

                <div className="section">
                    <div className='section-btn'>
                        <h3>Nombre d’heures par semaine : </h3>
                        {openModifier ? <button className='btn-modifier-houres' onClick={handelModifier}>modifier</button> : <button className='btn-modifier-houres' onClick={handlesouvgarder}>sauvegarder</button>}


                    </div>
                    <div className="list-item">
                        {openModifier ? <div><strong>{GroupDet.nbh_par_semaine_realisee}h</strong></div> : <input onChange={(e) => setNweHoures(e.target.value)} value={GroupDet.nbh_par_semaine_realisee} className='input-number' type="number" />}

                    </div>
                </div>
                <div className="section">
                    <h3>Contrôle continue réalisé  : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.contrôle_continue_réalisé}h</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>EFM réalisé  : </h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.efm_realise ? "Oui" : "Non"}</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Date début  :</h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.date_debut}</strong></div>
                    </div>
                </div>
                <div className="section">
                    <h3>Date fin  :</h3>
                    <div className="list-item">
                        <div><strong>{GroupDet.date_fin ? GroupDet.date_fin : "pas encore finie"}</strong></div>
                    </div>
                </div>
                <div className="section">
                    <div>
                        <button className='btn-modifier-houres'>
                            <FontAwesomeIcon className='faCircleLeft' icon={faCircleLeft} />
                            Retourner vers la liste</button>
                    </div>
                </div>

            </div>

        </>
    );
};
// <h1>Groupe : DEV205</h1>
//       <h2>modifier nombre heures par semaine</h2>
export default DetailsAvencemnet;






