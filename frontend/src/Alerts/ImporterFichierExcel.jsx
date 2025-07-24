import { useContext, useState } from "react";
import { useDarkMode } from "../DarkModeProvider/DarkModeContext";
import excelIcon from "../image/excel.png";
import apiService from "../Axios/apiService";
import "../style/ImporterFichierExcel.css";
import { AlertContext } from "../context/AlertContext";
import { Button } from "react-bootstrap";
import {  Loader } from "lucide-react";

export default function ImporterFichierExcel() {
  const { darkMode } = useDarkMode();
  const [excelFile, setExcelFile] = useState(null);
  const [typeImport, setTypeImport] = useState("avancements"); // valeur par défaut
   const { notification2,setNotification2,setLoading,setError, loading, error } = useContext(AlertContext);
const [isSubmitting, setIsSubmitting] = useState(false);


  const fetchAlertCounts = async () => {
    try {
      setLoading(true);
      await apiService.getCsrfCookie();

      const [notification2] = await Promise.all([
        apiService.getNotifications(),
      ]);

      setNotification2(notification2 || []);
    } catch (err) {
      console.error('Erreur lors du chargement des alertes :', err);
      setError('Erreur lors du chargement des alertes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExcel = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      alert("Veuillez sélectionner un fichier Excel.");
      return;
    }
    setIsSubmitting(true); // Start loader
    try {
      const result = await apiService.uploadStats(excelFile, typeImport);
      console.log("Réponse du serveur :", result);
      fetchAlertCounts();
      alert("Fichier importé avec succès !");

    } catch (error) {
      console.error("Erreur lors de l'import :", error);
      alert("Une erreur est survenue lors de l'import.");
    } finally {
      setIsSubmitting(false); // Stop loader
    }
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  return (
    <div
      className={
        darkMode
          ? "container-import-file-excel"
          : "container-import-file-excel container-import-file-excel-dark-mode"
      }

    >
      <h1>Importer fichier Excel :</h1>
      <div className="form-choisir-fichier">
        <img src={excelIcon} alt="Excel Icon" className="file-excel" />
        <form onSubmit={handleSubmitExcel} method="post" encType="multipart/form-data">
          <span className={darkMode ? "text-dark" : "text-light"}>Type des données :</span>
          <select
            value={typeImport}
            onChange={(e) => setTypeImport(e.target.value)}
            className="select-type form-select"
          >
            <option value="avancements">Avancements</option>
            <option value="dates_modules">Dates Modules</option>
          </select>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelChange}
            className="file-input"
          />
          
          {/* <input
            type="submit"
            value="Valider"
            className="submit-btn"
          /> */}



          <Button className="submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />}
            {isSubmitting ? "Importation..." : "Importer"}
          </Button>
        </form>
      </div>
    </div>
  );
}
