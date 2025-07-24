import { useLocation } from "react-router-dom";


// function to read query parameters from URL :
export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}