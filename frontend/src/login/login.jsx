import "../style/styleLogin.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../Axios/axios";
import { Button } from "react-bootstrap";
import { Loader } from "lucide-react";
import ForgotPasswordPage from "./ForgotPasswordPage";
// import ForgotPassword from "./forgetPassword";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function Login() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { formState: { isSubmitting, errors } } = form;

  async function onSubmit(values) {
    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      const response = await axiosClient.post("/login", values, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 204) {
        navigate("/app");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        form.setError('email', {
          type: 'manual',
          message: errors?.email?.[0] || 'Invalid credentials'
        });
        form.setError('password', {
          type: 'manual',
          message: errors?.password?.[0] || 'Invalid credentials'
        });
      } else {
        form.setError('root', {
          type: 'manual',
          message: error.response?.data?.message || 'Login failed. Please try again.'
        });
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        {errors.root && <div className="error-message">{errors.root.message}</div>}

        <form className="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className={`form-input ${errors.email ? "error" : ""}`}
              {...form.register("email")}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className={`form-input ${errors.password ? "error" : ""}`}
              {...form.register("password")}
            />
            {errors.password && (
              <span className="text-danger">{errors.password.message}</span>
            )}
            {/* <a href="forgot-password" className="forgot-password">Forgot password?</a> */}

          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />}
            {" "}Login
          </Button>
          <div style={{
            textAlign: "center"
          }}>
            Ou
            <p style={{width:"100%"}}>Créer un nouveau compte:</p>
          </div>
          <Button
            type="button"
            onClick={() => navigate("/register")}
            // className="register-button"
          >
            S&apos;inscrire
          </Button>
        </form>
      </div>
    </div>
  );
}