import { useState, useEffect, useMemo } from 'react';
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
import "../style/CalendrierEfm.css";
import apiService from "../Axios/apiService"; // Make sure apiService is correctly imported
import { Loader } from 'lucide-react';

const CalendrierEfm = () => {
    const [calendrierEfms, setCalendrierEfms] = useState([]);
    const [filtersData, setFiltersData] = useState({
        filieres: [],
        niveaux: [],
        annees_formation: []
    });
    const [filters, setFilters] = useState({
        code_filiere: '',
        niveau: '',
        annee_formation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { darkMode } = useDarkMode();
    const [currentPage, setCurrentPage] = useState(1);
    const postPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await apiService.getCsrfCookie(); // If Laravel Sanctum is used
                const response = await apiService.getCalendrierEfms();
                // console.log("response:", response)
                setCalendrierEfms(response.calendrierEfms || []);
                setFiltersData({
                    filieres: response.filters?.filieres || [],
                    niveaux: Object.values(response.filters?.niveaux || {}),
                    annees_formation: Object.values(response.filters?.annees_formation || {})
                });
            } catch (err) {
                console.error('Erreur API :', err);
                setError('Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({ code_filiere: '', niveau: '', annee_formation: '' });
        setCurrentPage(1);
    };

    const filteredData = useMemo(() => {
        return calendrierEfms.filter(doc => 
            (filters.code_filiere === '' || doc.code_filiere === filters.code_filiere) &&
            (filters.annee_formation === '' || doc.annee_formation === filters.annee_formation) &&
            (filters.niveau === '' || doc.niveau === filters.niveau)
        );
    }, [calendrierEfms, filters]);

    const paginatedData = useMemo(() => {
        const firstPostindex = (currentPage - 1) * postPerPage;
        return filteredData.slice(firstPostindex, firstPostindex + postPerPage);
    }, [filteredData, currentPage, postPerPage]);
    
    const totalPages = Math.ceil(filteredData.length / postPerPage);

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
                <span>Chargement de la page calendrier...</span>
            </div>
        );
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container-fluid-alets">
            <div className={darkMode ? "filter-container-alets" : "filter-container-alets filter-container-darkmode-alets"}>
                <h2>Dates EFMs:</h2>

                <div className="filter-controls">
                    <div className="filter-group">
                        <input
                            list="filiere"
                            id="filiereFilter"
                            name="filiereFilter"
                            value={filters.code_filiere || ''}
                            onChange={(e) => handleFilterChange('code_filiere', e.target.value)}
                            className="filter-select"
                            placeholder="Filiere"
                        />
                        <datalist id="filiere">
                            {filtersData.filieres.map(filiere => (
                                <option key={filiere.code_filiere} value={filiere.code_filiere} >{filiere.libelle}</option>
                            ))}
                        </datalist>
                    </div>

                    {/* Niveau Filter */}
                    <div className="filter-group">
                        <input
                            list="niveau"
                            id="niveauFilter"
                            name="niveauFilter"
                            value={filters.niveau || ''}
                            onChange={(e) => handleFilterChange('niveau', e.target.value)}
                            className="filter-select"
                            placeholder="Niveau"
                        />
                        <datalist id="niveau">
                            {filtersData.niveaux.map(niveau => (
                                <option key={niveau} value={niveau} />
                            ))}
                        </datalist>
                    </div>

                    {/* Annee Filter */}
                    <div className="filter-group">
                        <input
                            list="anneeOptions"
                            id="anneeFilter"
                            name="anneeFilter"
                            value={filters.annee_formation || ''}
                            onChange={(e) => handleFilterChange('annee_formation', e.target.value)}
                            className="filter-select"
                            placeholder="Sélectionner Annee formation"
                        />
                        <datalist id="anneeOptions">
                            {filtersData.annees_formation.map(annee => (
                                <option key={annee} value={annee} />
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
                    <div className={darkMode ? "card-CalendrierEfm mb-4" : "card-CalendrierEfm mb-4 card-CalendrierEfm-dark-mode"}>
                        <div className={darkMode ? "card-body" : "card-body card-body_dark_alets"}>
                            {paginatedData.length > 0 ?
                                <table className={darkMode ? "table table-striped" : "table table-dark table-striped"}>
                                    <thead>
                                        <tr>
                                            <th>code filière</th>
                                            <th>code groupe</th>
                                            <th>Code module</th>
                                            <th>régionale</th>
                                            <th>date efm prévu</th>
                                            <th>date efm réelle</th>
                                        </tr>
                                    </thead>
                                    {paginatedData.length > 0 ?
                                        <tbody>
                                            {paginatedData.map((avince) => (
                                                <tr key={avince.id}>
                                                    <td>{avince.code_filiere}</td>
                                                    <td>{avince.code_groupe}</td>
                                                    <td>{avince.code_module}</td>
                                                    <td>{avince.regional}</td>
                                                    <td>{avince.date_efm_prevu ? avince.date_efm_prevu : "Date à déterminer"}</td>
                                                    <td>{avince.date_efm_reelle ? avince.date_efm_reelle : "Date à déterminer"}</td>
                                                </tr>
                                            ))}
                                        </tbody> :
                                        "Not data"
                                    }
                                </table> :
                                ""
                            }
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-container-CalendrierEfm">
                                <button
                                    className="pagination-btn-CalendrierEfm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Précédent
                                </button>
                                <span className="current-page-CalendrierEfm">Page {currentPage} sur {totalPages}</span>
                                <button
                                    className="pagination-btn-CalendrierEfm"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendrierEfm;
