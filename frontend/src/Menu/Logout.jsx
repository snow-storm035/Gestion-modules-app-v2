// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
// export default function Logout(){
//     return <>
//     <div>
//     <FontAwesomeIcon icon={faRightFromBracket} style={{fontSize:"20px"}}/>
//     <button className="logout">Déconnexion</button>

//     </div>
//     </>
// }

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../Axios/axios'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosClient.post('/logout');
            // Clear client-side data
            localStorage.clear();
            // Redirect to login
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Optional: Handle error (show message, etc.)
        }
    };

    return (
        <div className='logA'>
            <FontAwesomeIcon 
                icon={faRightFromBracket} 
                style={{ fontSize: "20px" }}
            />
            <button 
                className="logout" 
                onClick={handleLogout}
            >
                Déconnexion
            </button>
        </div>
    );
}