import "../style/stylewelcome.css";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleLoginClick = () => {
        navigate("/login"); // Redirect to /login
    };

    const handleRegisterClick = () => {
        navigate("/register"); // Redirect to /register
    };

    return (
        <div className="welcome-container">
            <div className="content-overlay">
                <h1 className="welcome-title">Welcome Director!</h1>
                <div className="button-group">
                    <button 
                        onClick={handleLoginClick} 
                        className="welcome-button login-button"
                    >
                        Login
                    </button>
                    <button 
                        onClick={handleRegisterClick} 
                        className="welcome-button register-button"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}