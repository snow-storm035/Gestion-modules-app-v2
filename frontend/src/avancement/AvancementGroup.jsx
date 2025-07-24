import { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';// import { useState } from 'react';
import "../style/AvancemnetGroup.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
// className="darkmode"
// aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
import { useNavigate } from 'react-router-dom';
import apiService from '../Axios/apiService';
import { Loader } from 'lucide-react';
import { useQuery } from '../Hooks/custom-react-hooks';
const AvancemnetGroup = () => {

  const query = useQuery()
  const filiere = query.get('filiere')
  const code_module = query.get('module')


  const [documentsAvencemnet, setDocumentsAvencemnet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    filiere: filiere ? filiere: '',
    module: code_module ? code_module : '',
    groupe: '',
    niveau: '',
    formateur: '',
    annee_formation: '',
    semestre: ''

  });
  const [filters1234, setFilters1234] = useState({
    filieres: [],
    groupes: [],
    modules: [],
    annees_formation: [],
    niveaux: [],
    formateurs: [],
    semestres: []
  });
  const { darkMode } = useDarkMode();


  // const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 7;
  const lastPostindex = currentPage * postPerPage;
  const firstPostindex = lastPostindex - postPerPage;


  // Data fetching
  useEffect(() => {
    console.log("Fetching avancements...");
    const fetchData = async () => {
      try {
        setLoading(true);
        await apiService.getCsrfCookie();
        const response = await apiService.getAvancements();
        // console.log("response:",response.filters)

        // Directly use the response data rather than relying on the state in the next line
        const avancementsData = response.avancements || [];
        // const setFilters1234dsa =  response.filters ||[];
        // console.log(response)
        setDocumentsAvencemnet(avancementsData);
        // Set the entire filters object to state
        setFilters1234(response.filters || {
          filieres: [],
          groupes: [],
          modules: [],
          annees_formation: [],
          niveaux: [],
          formateurs: [],
          semestres: []
        });


        // If you need to log the new value, do it here with the local variable
        console.log("avencementData:", avancementsData);
        console.log("filters in state:", response.filters); // Log directly from resp
        // console.log("filters:",filters1234)
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array means it runs once on mount      
  useEffect(() => {
    console.log("Current filters statesdfghjklcvbnm,.:", filters1234);
    console.log("group:", filters1234)
  }, [filters1234]);
  //   end code fetch data

  // Sample data - replace with your actual data


  // const documentsAvencemnet = [
  //   {
  //     id: 1,
  //     filière: { code: 'FIL101', nom: 'Développement Digital' },
  //     module: { code: 'M301', nom: 'JavaScript Avancé' },
  //     groupe: { code: 'GRP01', nom: 'Groupe A', annee_formation: '2023-2024' },
  //     formateur: { code: 'FORM001', nom: 'Ahmed Khan', spécialité: 'Frontend', statut: 'Interne' },
  //     niveau: 'TS',
  //     nbh_par_semaine_realisee: 4.0,
  //     date_debut: '2023-09-01',
  //     date_fin: '2023-12-15',
  //     taux_realise: 82.5,
  //     semestre:"S1"

  //   },
  //   {
  //     id: 2,
  //     filière: { code: 'FIL102', nom: 'Réseaux Informatiques' },
  //     module: { code: 'M302', nom: 'Cisco CCNA' },
  //     groupe: { code: 'GRP02', nom: 'Groupe B', annee_formation: '2023-2024' },
  //     formateur: { code: 'FORM002', nom: 'Marie Dupont', spécialité: 'Réseaux', statut: 'Externe' },
  //     niveau: 'T',
  //     nbh_par_semaine_realisee: 3.5,
  //     date_debut: '2023-10-01',
  //     date_fin: '2024-01-20',
  //     taux_realise: 68.3,
  //     semestre:"S1"
  //   },
  //   {
  //     id: 3,
  //     filière: { code: 'FIL103', nom: 'Data Science' },
  //     module: { code: 'M303', nom: 'Machine Learning' },
  //     groupe: { code: 'GRP03', nom: 'Groupe C', annee_formation: '2023-2024' },
  //     formateur: { code: 'FORM003', nom: 'Carlos Silva', spécialité: 'AI', statut: 'Interne' },
  //     niveau: 'TS',
  //     nbh_par_semaine_realisee: 5.0,
  //     date_debut: '2023-11-01',
  //     date_fin: '2024-02-10',
  //     taux_realise: 91.2,
  //     semestre:"S2"
  //   },
  //   {
  //     id: 4,
  //     filière: { code: 'FIL104', nom: 'Design Graphique' },
  //     module: { code: 'M304', nom: 'UI/UX Design' },
  //     groupe: { code: 'GRP04', nom: 'Groupe D', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM004', nom: 'Sophie Martin', spécialité: 'Design', statut: 'Externe' },
  //     niveau: 'T',
  //     nbh_par_semaine_realisee: 2.5,
  //     date_debut: '2024-01-15',
  //     date_fin: '2024-04-30',
  //     taux_realise: 75.0,
  //     semestre:"S1"
  //   },
  //   {
  //     id: 5,
  //     filière: { code: 'FIL105', nom: 'Marketing Digital' },
  //     module: { code: 'M305', nom: 'SEO Avancé' },
  //     groupe: { code: 'GRP05', nom: 'Groupe E', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM005', nom: 'John Smith', spécialité: 'Marketing', statut: 'Interne' },
  //     niveau: 'TS',
  //     nbh_par_semaine_realisee: 3.0,
  //     date_debut: '2024-02-01',
  //     date_fin: '2024-05-15',
  //     taux_realise: 60.8,
  //     semestre:"S1"
  //   },
  //   {
  //     id: 6,
  //     filière: { code: 'FIL106', nom: 'Bureautique' },
  //     module: { code: 'M306', nom: 'Excel Expert' },
  //     groupe: { code: 'GRP06', nom: 'Groupe F', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM006', nom: 'Fatima Zahra', spécialité: 'Bureautique', statut: 'Interne' },
  //     niveau: 'T',
  //     nbh_par_semaine_realisee: 2.0,
  //     date_debut: '2024-03-10',
  //     date_fin: '2024-06-20',
  //     taux_realise: 45.5,
  //     semestre:"S1"
  //   },
  //   {
  //     id: 7,
  //     filière: { code: 'FIL107', nom: 'Cloud Computing' },
  //     module: { code: 'M307', nom: 'AWS Solutions' },
  //     groupe: { code: 'GRP07', nom: 'Groupe G', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM007', nom: 'David Wilson', spécialité: 'Cloud', statut: 'Externe' },
  //     niveau: 'TS',
  //     nbh_par_semaine_realisee: 4.5,
  //     date_debut: '2024-04-05',
  //     date_fin: '2024-07-10',
  //     taux_realise: 88.7,
  //     semestre:"S1"
  //   },
  //   {
  //     id: 8,
  //     filière: { code: 'FIL108', nom: 'Cybersécurité' },
  //     module: { code: 'M308', nom: 'Ethical Hacking' },
  //     groupe: { code: 'GRP08', nom: 'Groupe H', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM008', nom: 'Elena Petrova', spécialité: 'Sécurité', statut: 'Externe' },
  //     niveau: 'TS',
  //     nbh_par_semaine_realisee: 5.0,
  //     date_debut: '2024-05-01',
  //     date_fin: '2024-08-15',
  //     taux_realise: 95.3,
  //     semestre:"S2"
  //   },
  //   {
  //     id: 9,
  //     filière: { code: 'FIL109', nom: 'Gestion de Projet' },
  //     module: { code: 'M309', nom: 'Agile Scrum' },
  //     groupe: { code: 'GRP09', nom: 'Groupe I', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM009', nom: 'Mohammed Ali', spécialité: 'Management', statut: 'Interne' },
  //     niveau: 'T',
  //     nbh_par_semaine_realisee: 3.5,
  //     date_debut: '2024-06-01',
  //     date_fin: '2024-09-10',
  //     taux_realise: 72.1,
  //     semestre:"S2"
  //   },
  //   {
  //     id: 10,
  //     filière: { code: 'FIL110', nom: 'DevOps' },
  //     module: { code: 'M310', nom: 'Docker & Kubernetes' },
  //     groupe: { code: 'GRP10', nom: 'Groupe J', annee_formation: '2024-2025' },
  //     formateur: { code: 'FORM010', nom: 'Lina Chen', spécialité: 'DevOps', statut: 'Externe' },
  //     niveau: 'TS',
  //     nbh_par_semaine_realisee: 4.0,
  //     date_debut: '2024-07-01',
  //     date_fin: '2024-10-15',
  //     taux_realise: 79.9,
  //     semestre:"S1"
  //   }
  // ];

  // Extract unique values for filters


  // const formateurs = [...new Set(documentsAvencemnet.map(doc => doc.formateur.nom))];




  // Filter function
  const filterFiliereModuleGroupniveauFourmateur = documentsAvencemnet.filter(doc => {
    console.log("filters.model:", filters.module)
    return (
      // Filière filter (use code_filiere instead of filière.nom)
      (filters.filiere === '' || doc.code_filiere === filters.filiere) &&

      // Module filter (use code_module instead of module.nom)
      (filters.module === '' || doc.code_module === filters.module) &&


      // Groupe filter (use code_groupe instead of groupe.nom)
      (filters.groupe === '' || doc.code_groupe === filters.groupe) &&

      // Niveau filter (extract from code_filiere if needed)
      (filters.niveau === '' || doc.code_filiere.endsWith(`_${filters.niveau}`)) &&

      // Formateur filter (use matricule instead of formateur.nom)
      (filters.formateur === '' || doc.nom_formateur === filters.formateur) &&
      (filters.semestre === '' || doc.semestre === filters.semestre) &&
      (filters.annee_formation === '' || doc.annee_formation === +filters.annee_formation) &&

      // Remove annee_formation filter (not present in data)
      // Remove semestre filter (not present in data)
      true // Placeholder for valid conditions
    );

  });
  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1)
  }
  // }
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      filiere: '',
      module: '',
      groupe: '',
      niveau: '',
      annee_formation: '',
      formateur: '',
      semestre: ''
    });

    // replacing the url without refreshing
    navigate(location.pathname, {replace: true})
  };
  // code fellter by toux realise 
  // const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  console.log("filteredavoncesWithsplice####dddddddddddddddddddddddddddddd###############")
  const [sortDirection, setSortDirection] = useState('desc');

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedDocuments = [...filterFiliereModuleGroupniveauFourmateur].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.taux_total_realisee - b.taux_total_realisee;
    } else {
      return b.taux_total_realisee - a.taux_total_realisee;
    }
  });

  // Apply sorting to filtered documents


  const filteredavoncesWithsplice = sortedDocuments.slice(firstPostindex, lastPostindex)
  // console.log("filteredavoncesWithsplice################################################")
  // console.log(filteredavoncesWithsplice)
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
        <span>Chargement de la page avancements groupes ...</span>
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  return (
    <>


      <div className="container-fluid-avancement">
        {/* <div className="filter-container"> */}
        {filters1234.filieres.length > 0 ?

          (<div className={darkMode ? "filter-container" : "filter-container filter-container-darkmode"}>
            <h2>Liste des avancements par groupe:</h2>
            <div className="filter-controls">
              {/* Filière Filter */}

              <div className="filter-group">
                <input
                  list="filiere"
                  id="filiereFilter"
                  name="filiereFilter"
                  value={filters.filiere}
                  onChange={(e) => handleFilterChange('filiere', e.target.value)}
                  className="filter-select"
                  placeholder="filieres"
                />
                <datalist id="filiere">
                  {filters1234.filieres.map(filiere => (
                    <option
                      key={filiere.code_filiere}
                      value={`${filiere.code_filiere}`}
                    >
                      {`${filiere.code_filiere} - ${filiere.libelle}`}
                    </option>
                  ))}
                </datalist>
              </div>


              {/* Module Filter */}

              <div className="filter-group">
                <input
                  list="modules"
                  id="modulesFilter"
                  name="modulesFilter"
                  value={filters.module}
                  onChange={(e) => handleFilterChange('module', e.target.value)}
                  className="filter-select"
                  placeholder="modules"
                />
                <datalist id="modules">
                  {filters1234.modules.map((module, index) => (
                    <option
                      key={index}
                      value={module.code[1]} // This is what gets submitted (hidden from user)
                    >
                      {/* This is what the user sees in the dropdown */}
                      {`${module.code[1]} - ${module.libelle}`}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Groupe Filter */}


              <div className="filter-group">
                <input
                  list="groupes"
                  id="groupesFilter"
                  name="groupesFilter"
                  value={filters.groupe}
                  onChange={(e) => handleFilterChange('groupe', e.target.value)}
                  className="filter-select"
                  placeholder="groupes"
                />
                <datalist id="groupes">
                  {filters1234.groupes.map(groupe => (
                    <option
                      key={groupe.code_groupe}
                      value={groupe.code_groupe}
                    />
                  ))}
                </datalist>
              </div>


              {/* annee_formation Filter */}

              <div className="filter-group">
                <input
                  list="annee_formation"
                  id="annee_formationFilter"
                  name="annee_formationFilter"
                  value={filters.annee_formation}
                  onChange={(e) => handleFilterChange('annee_formation', e.target.value)}
                  className="filter-select"
                  placeholder="Année formation"
                />
                <datalist id="annee_formation">
                  {filters1234.annees_formation.map(annee => (
                    <option key={annee} value={annee} />
                  ))}
                </datalist>
              </div>

              {/* Niveau Filter */}

              <div className="filter-group">
                <input
                  list="niveau"
                  id="niveauFilter"
                  name="niveauFilter"
                  value={filters.niveau}
                  onChange={(e) => handleFilterChange('niveau', e.target.value)}
                  className="filter-select"
                  placeholder="Niveaux"
                />
                {/* <datalist id="niveau">
                  {[...new Set(filters1234.niveaux)].map(niveau => (  // Removes duplicates
                    <option key={niveau} value={niveau} />  // Now keys are unique
                  ))}
                </datalist> */}
                <datalist id="niveau">
                  {[...new Set(filters1234.niveaux.filter(n => n && n.trim() !== ''))]
                    .map((niveau, index) => (
                      <option key={`${niveau}-${index}`} value={niveau} />
                    ))}
                </datalist>
              </div>

              {/* Formateur Filter */}
              {filters1234.formateurs.length > 0 ? <div className="filter-group">

                <input
                  list="formateurs"
                  id="formateursFilter"
                  name="formateursFilter"
                  value={filters.formateur}
                  onChange={(e) => handleFilterChange('formateur', e.target.value)}
                  className="filter-select"
                  placeholder="formateurs"
                />
                <datalist id="formateurs">
                  {filters1234.formateurs.map(data => (

                    <option key={data.matricule} value={data.nom_formateur} >
                      {data.matricule} - {data.nom_formateur}
                    </option>
                  ))}

                </datalist>
              </div> :
                ""}
              {/* Semestre Filter */}
              <div className="filter-group">

                <input
                  list="semestre"
                  id="semestreFilter"
                  name="semestreFilter"
                  value={filters.semestre}
                  onChange={(e) => handleFilterChange('semestre', e.target.value)}
                  className="filter-select"
                  placeholder="semestre"
                />
                <datalist id="semestre">
                  {filters1234.semestres?.map(semestre => (
                    <option key={semestre} value={semestre} />
                  ))}

                </datalist>
              </div>

              {/* Reset Button */}
              <button onClick={resetFilters} className="reset-btn">
                Réinitialiser
              </button>
            </div>
          </div>) :
          ""

        }
        <div className="row">
          <div className="col-12">
            <div className={darkMode ? "card-groupes mb-4" : "card-groupes mb-4 card-groupes-dark-mode"}>
              {/* <div className="card-body"> */}
              <div className={darkMode ? "card-body-group" : "card-body-group card-body_dark_avancement"}>
                <div className="table-responsive">
                  {/* <table className="table table-striped"> */}
                  <table className={darkMode ? "table table-striped" : "table table-dark table-striped"}>
                    <thead>
                      <tr>
                        <th>code filière</th>
                        <th>Code groupe</th>
                        <th>Code module</th>
                        <th>matricule formateur</th>
                        <th>nbh_par_semaine</th>


                        <th
                          className="sortable-header"
                          onClick={toggleSort}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Taux Réalisé
                            {sortDirection === 'asc' ?
                              <FaSortAmountUp className="sort-icon active" /> :
                              <FaSortAmountDown className="sort-icon active" />
                            }
                          </div>
                        </th>

                        <th>Actions </th>


                      </tr>
                    </thead>
                    {/* code_filiere
 0 => array:27 [▼
    "id" => 1
    "code_module" => "M104"
    "code_filiere" => "GC_GE_TS"
    "matricule" => "17325"
    "code_groupe" => "GE101"
    "nbh_par_semaine_p" => 0.0
    "nbh_par_semaine_sync" => 0.0
    "nbh_par_semaine_total" => 0.0
    "debut_module" => "2020-10-10"
    "fin_module" => null
    "date_efm_prevu" => null
    "date_efm_reelle" => null
    "nbhp_realisee" => 90.0
    "nbhsync_realisee" => 30.0
    "nbh_total_realisee" => 120.0
    "prec_nbhp_realisee" => 90.0
    "prec_nbhsync_realisee" => 30.0
    "prec_nbh_total_realisee" => 120.0
    "taux_total_realisee" => 100.0
    "nbcc_realisee" => 3
    "efm_realise" => "oui"
    "created_at" => "2025-05-10T16:24:34.000000Z"
    "updated_at" => "2025-05-23T08:10:19.000000Z"
    "niveau" => "TS"
    "nom_formateur" => "FATIMA-EZZAHRA HIRRY"
    "semestre" => "s1"
    "annee_formation" => 1
                    ]*/}
                    <tbody>
                      {filteredavoncesWithsplice.map((avince) => (
                        <tr key={avince.id}>
                          <td>{avince.code_filiere}</td>
                          <td>{avince.code_groupe}</td>
                          <td>{avince.code_module}</td>
                          <td>{avince.nom_formateur}</td>
                          <td>{avince.nbh_par_semaine_p}</td>
                          <td>{(avince.taux_total_realisee.toFixed(2))}%</td>
                          <td>
                            <button className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                navigate(`/app/avancementDetail/${avince.code_groupe}/${avince.code_module}`);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                              />
                            </button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pagination-container-groupe">
                  <button
                    className="pagination-btn-groupe"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Précédent
                  </button>
                  <span className="current-page-groupe">Page {currentPage}</span>
                  <button
                    className="pagination-btn-groupe"

                    disabled={filteredavoncesWithsplice.length < postPerPage}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AvancemnetGroup;