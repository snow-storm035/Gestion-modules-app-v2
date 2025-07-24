import "../style/styleRegister.css";
import { useDarkMode } from '../DarkModeProvider/DarkModeContext';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../Axios/axios";
import { Loader2 as Loader } from "lucide-react";
import { useState } from "react";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be less than 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"]
});

export default function Register() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      // Send registration request
      const response = await axiosClient.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation
      });

      // Success: redirect to login
      if (response.status === 201 || response.status === 200 || response.status === 204) {
        reset();
        navigate("/login");
      }
    } catch (error) {
      // Laravel validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          setError(key, {
            type: 'manual',
            message: errors[key][0]
          });
        });
      } else {
        setServerError(
          error.response?.data?.message ||
          "Registration failed. Please try again later."
        );
      }
    }
  };

  return (
    <div className={`register-container ${darkMode ? 'dark' : ''}`}>
      <div className="register-card">
        <h1 className="register-title">Register</h1>
        {serverError && <div className="error-message">{serverError}</div>}
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              className={`form-input ${errors.name ? "error" : ""}`}
              {...register("name")}
            />
            {errors.name && <span className="text-danger">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className={`form-input ${errors.email ? "error" : ""}`}
              {...register("email")}
            />
            {errors.email && <span className="text-danger">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Enter password (min 8 chars)"
              className={`form-input ${errors.password ? "error" : ""}`}
              {...register("password")}
            />
            {errors.password && <span className="text-danger">{errors.password.message}</span>}
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password_confirmation"
              placeholder="Confirm password"
              className={`form-input ${errors.password_confirmation ? "error" : ""}`}
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && <span className="text-danger">{errors.password_confirmation.message}</span>}
          </div>
          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin inline mr-2" size={18} />
                Registering...
              </>
            ) : "Register"}
          </button>
          <div style={{
            textAlign: "center"
          }}>
            Ou
            <p style={{width:"100%"}}>se connecter:</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="register-button"
          >
            se connecter
          </button>
        </form>
      </div>
    </div>
  );
}