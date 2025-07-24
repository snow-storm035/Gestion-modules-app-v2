

import { useState, useEffect } from 'react';
import "../style/stylelist_model.css";
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
import apiService from '../Axios/apiService';
import { Loader } from 'lucide-react';

const Etatmodel = () => {
  const { darkMode } = useDarkMode();
  const [filters, setFilters] = useState({
    code_filiere: '',
    code_module: '',
    code_groupe: '',
    regionale: ''
  });
  
  const [modulesStats, setModulesStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersData, setFiltersData] = useState({
    filieres: [],
    groupes: [],
    modules: [],
    regional: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 9;
  const lastPostindex = currentPage * postPerPage;
  const firstPostindex = lastPostindex - postPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await apiService.getCsrfCookie();
        const response = await apiService.getEtatsModules();
        console.log("API Response:", response);
        
        // Safely handle the response data
        const receivedModulesStats = response.modulesstats || [];
        const receivedFilters = response.filters || {
          filieres: [],
          groupes: [],
          modules: [],
          regional: []
        };

        setModulesStats(receivedModulesStats);
        setFiltersData({
          filieres: receivedFilters.filieres || [],
          groupes: receivedFilters.groupes || [],
          modules: receivedFilters.modules || [],
          regional: receivedFilters.regional || ['oui', 'non'] // Default values if not provided
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
useEffect(()=>{
console.log("filtersData models:",filtersData.modules)
},[filtersData])
  // Filter modules based on selected filters
  const filteredModules = modulesStats.filter(module => {
    // Find the filiere that matches the module's groupe
    const filiere = filtersData.filieres.find(f => 
      f.groupes?.some(g => g.code_groupe === module.code_groupe)
    );
    
    return (
      (filters.code_filiere === '' || 
       (filiere && filiere.code_filiere === filters.code_filiere)) &&
      (filters.code_module === '' || module.code_module === filters.code_module) &&
      (filters.code_groupe === '' || module.code_groupe === filters.code_groupe) &&
      (filters.regionale === '' || 
       module.regional?.toLowerCase() === filters.regionale.toLowerCase())
    );
  });

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      code_filiere: '',
      code_module: '',
      code_groupe: '',
      regionale: ''
    });
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  // Paginate the filtered modules
  const paginatedModules = filteredModules.slice(firstPostindex, lastPostindex);

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
      <span>Chargement de la page état modules...</span>
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid-model">
      <div className={darkMode ? "filter-container" : "filter-container filter-container-darkmode"}>
        <div className="filter-controls">
          {/* Filière Filter */}
          <div className="filter-group">
            <input
              list="code_filiere"
              id="code_filiereFilter"
              name="code_filiereFilter"
              value={filters.code_filiere}
              onChange={(e) => handleFilterChange('code_filiere', e.target.value)}
              className="filter-select"
              placeholder="Filière"
            />
            <datalist id="code_filiere">
              {filtersData.filieres.map(filiere => (
                <option key={filiere.code_filiere} value={filiere.code_filiere}>
                  {filiere.libelle}
                </option>
              ))}
            </datalist>
          </div>

          {/* Module Filter */}
          <div className="filter-group">
            <input
              list="code_module"
              id="code_moduleFilter"
              name="code_moduleFilter"
              value={filters.code_module}
              onChange={(e) => handleFilterChange('code_module', e.target.value)}
              className="filter-select"
              placeholder="Module"
            />
            <datalist id="code_module">
              {filtersData.modules.map(module => (
                <option key={module.code} value={module.code[1]}>
                  {module.libelle || module.code}
                </option>
              ))}
            </datalist>
          </div>
          
          {/* Groupe Filter */}
          <div className="filter-group">
            <input
              list="code_groupe"
              id="code_groupeFilter"
              name="code_groupeFilter"
              value={filters.code_groupe}
              onChange={(e) => handleFilterChange('code_groupe', e.target.value)}
              className="filter-select"
              placeholder="Groupe"
            />
            <datalist id="code_groupe">
              {filtersData.groupes.map(groupe => (
                <option key={groupe.code_groupe} value={groupe.code_groupe} />
              ))}
            </datalist>
          </div>

          {/* Régionale Filter */}
          <div className="filter-group">
            <input
              list="regionale"
              id="regionaleFilter"
              name="regionaleFilter"
              value={filters.regionale}
              onChange={(e) => handleFilterChange('regionale', e.target.value)}
              className="filter-select"
              placeholder="Regionale"
            />
            <datalist id="regionale">
              {filtersData.regional.map(regionale => (
                <option key={regionale} value={regionale} />
              ))}
            </datalist>
          </div>
          
          {/* Reset Button */}
          <button onClick={resetFilters} className="reset-btn">
            Réinitialiser
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className={darkMode ? "card-Etatmodel mb-4" : "card-Etatmodel mb-4 card-Etatmodel-dark-Mode"}>
            <div className={darkMode ? "card-body-model" : "card-body-model card-body-model-darkmode"}>
              <div className='flex-ajouter-model'>
                <h2 className="pb-3 font-weight-bold ">États des modules</h2>
              </div>
              
              <div className="table-responsive">
                <table className={darkMode ? "table table-striped" : "table table-dark table-striped"}>
                  <thead>
                    <tr>
                      <th>Code Module</th>
                      <th>Code Groupe</th>
                      <th>Filière</th>
                      <th>Libellé Module</th>
                      <th>Régionale</th>
                      <th>État</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedModules.length > 0 ? (
                      paginatedModules.map((module, index) => {
                        // Find the filiere for this module
                        // const filiere = filtersData.filieres.find(f => 
                        //   f.groupes?.some(g => g.code_groupe === module.code_groupe)
                        // );
                        
                        return (
                          <tr key={`${module.code_module}-${module.code_groupe}-${index}`}>
                            <td>{module.code_module}</td>
                            <td>{module.code_groupe}</td>
                            {/* <td>{filiere?.libelle || 'N/A'}</td> */}
                            <td>{module.nom_filiere}</td>
                            <td>{module.libelle_module}</td>
                            <td>{module.regional}</td>
                            <td>{module.etat}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">Aucun module trouvé</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-container-model">
                <button
                  className="pagination-btn-model"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Précédent
                </button>
                <span className="current-page-model">Page {currentPage}</span>
                <button
                  className="pagination-btn-model"
                  disabled={paginatedModules.length < postPerPage}
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
  );
};

export default Etatmodel;