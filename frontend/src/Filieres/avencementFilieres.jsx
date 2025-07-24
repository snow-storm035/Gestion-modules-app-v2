

import { useState, useEffect } from 'react';
import "../style/avencementFilieres.css";
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
import { useNavigate } from 'react-router-dom';
import apiService from '../Axios/apiService';
import { Loader } from 'lucide-react';

const AvencementFiliere = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 8;
  const [filters, setFilters] = useState({
    code_filiere: '',
    code_module: ''
  });

  const [filieresData, setFilieresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersData, setFiltersData] = useState({
    filieres: [],
    modules: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await apiService.getCsrfCookie();
        const response = await apiService.getFilieres();
        
        // Extract data from response
        const { modules = [], filieres = [], secteurs = {}, niveaux = {}, regional = [] } = response;
  
        // Combine modules with their corresponding filières
        const filieresWithModules = filieres.map(filiere => {
          // Find all modules that belong to this filiere
          const filiereModules = modules.filter(
            module => module.code_filiere === filiere.code_filiere
          );
          
          // Return the filiere object with added modules array
          return {
            ...filiere,
            modules: filiereModules
          };
        });
  
        // Set the state with combined data
        setFilieresData(filieresWithModules);
        setFiltersData({
          filieres,
          modules,
          secteurs: Object.values(secteurs),
          niveaux: Object.values(niveaux),
          regional
        });
  
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Flatten the data for table display
  const flattenedData = filieresData.flatMap(filiere => 
    filiere.modules.map(module => ({
      ...filiere,
      ...module
    }))
  );

  // Filter the flattened data
  const filteredData = flattenedData.filter(item => {
    return (
      (filters.code_filiere === '' || item.code_filiere === filters.code_filiere) &&
      (filters.code_module === '' || item.code_module === filters.code_module)
    );
  });

  const resetFilters = () => {
    setFilters({
      code_filiere: '',
      code_module: ''
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * postPerPage,
    currentPage * postPerPage
  );

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
      <span>Chargement de la page filières...</span>
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid">
      <div className={darkMode?"avancements-h2":"avancements-h2 avancements-h2-dark-mode"}>
        <h2>Liste des avancements par Filières:</h2>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className={darkMode?"card-Filiere mb-4":"card-Filiere mb-4 card-Filiere-dark-mode"}>
            <div className={darkMode ? "card-body-Filiere" : "card-body-Filiere card-body-dark-filiere"}>
              
              {/* Filière Filter */}
              <div className="filter-group">
                <input
                  list="code_filiere"
                  id="code_filiereFilter"
                  name="code_filiereFilter"
                  value={filters.code_filiere}
                  onChange={(e) => handleFilterChange('code_filiere', e.target.value)}
                  className="filter-select"
                  placeholder="Code Filière"
                />
                <datalist id="code_filiere">
                  {filtersData.filieres.map(filiere => (
                    <option key={`filiere-${filiere.code_filiere}`} value={filiere.code_filiere}>
                      {filiere.nom_filiere}
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
                  placeholder="Code Module"
                />
                <datalist id="code_module">
                  {filtersData.modules.map(module => (
                    <option key={`module-${module.code_module}`} value={module.code_module}>
                      {module.module}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Reset Button */}
              <button onClick={resetFilters} className="reset-btn-filiere">
                Réinitialiser
              </button>
            </div>

            <div className="table-responsive">
              <table className={darkMode ? "table table-striped" : "table table-dark table-striped"}>
                <thead>
                  <tr>
                    <th>Code Filière</th>
                    <th>Code Module</th>
                 
                    <th>Taux Avancement</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={`${item.code_filiere}-${item.code_module}`}>
                        <td>{item.code_filiere}</td>
                        <td>{item.code_module}</td>
                 
                        <td>{item.taux_avancement.toFixed(2)}%</td>
                        <td>
                          <button 
                            className='btn-Detail-filiere' 
                            onClick={() => navigate("/app/avancemnetGroup?filiere="+item.code_filiere+"&module="+item.code_module)}
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Aucune donnée trouvée</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-container-filiere">
              <button
                className="pagination-btn-filiere"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Précédent
              </button>
              <span className="current-page-filiere">Page {currentPage}</span>
              <button
                className="pagination-btn-filiere"
                disabled={paginatedData.length < postPerPage}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvencementFiliere;