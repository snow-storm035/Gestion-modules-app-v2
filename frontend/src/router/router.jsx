import Etatmodel from "../modules/etatmodel";
import AvancemnetGroup from "../avancement/AvancementGroup";
import AvancementDetails from "../avancement/AvancementDetails";
import AvencementFiliere from "../Filieres/avencementFilieres";
import Alerts from "../Alerts/alert";
import ImporterFichierExcel from "../Alerts/ImporterFichierExcel";
import CalendrierEfm from "../modules/calendrierEfm";
import UpdateModuleStatu from "../group/UpdateModuleStatu";
import Login from "../login/login";
import Register from "../login/register";
import Home from "../Homepage/Home";
import Layout from "../Menu/Layout";
import PageNotFound from "../PageNotFound/pageNotFound";
import Welcome from "../login/welcome";
import ResetPasswordPage from "../login/ResetPasswordPage";
import ForgotPasswordPage from "../login/ForgotPasswordPage";
import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireNotAuth from "./RequireNotAuth";

export const dashbord = "/student/dashbord";

export const router = createBrowserRouter([
  // Public routes (no layout)
  {
    path: "/",
    element: (
      <RequireNotAuth>
        <Welcome /> 
      </RequireNotAuth>
      ),
  },
  {
    path: "/login",
    element:(<RequireNotAuth>
      <Login />
    </RequireNotAuth>),
  },
  
  // {
  //   path: "/test",
  //   element: <Dashboard />,
  // },
  {
    path: "/register",
    element:(<RequireNotAuth>
      <Register />
    </RequireNotAuth>),
  },
  // {
  //   path: "/reset-password",
  //   element: <ResetPasswordPage />,
  // },
  // {
  //   path: "/forgot-password",
  //   element: <ForgotPasswordPage />,
  // },
  // Protected routes (with layout)
  {
    path: "/app", // Base path for all layout-wrapped routes
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        index: true, // Automatically renders Home when /app is accessed
        element: <Home />,
      },
      {
        path: "etatmodel", // `/app/etatmodel`
        element: <Etatmodel />,
      },
      {
        path: "avancemnetGroup", // `/app/avancemnetGroup`
        element: <AvancemnetGroup />,
      },
      {
        path: "avancementDetail/:groupe/:module",
        element: <AvancementDetails />,
      },
      
      {
        path: "avencementFiliere", // `/app/avencementFiliere`
        element: <AvencementFiliere />,
      },
      {
        path: "alerts", // `/app/alerts`
        element: <Alerts />,
      },
      {
        path: "importerfichierexcel", // `/app/importerfichierexcel`
        element: <ImporterFichierExcel />,
      },
      {
        path: "calendrierEfm", // `/app/calendrierEfm`
        element: <CalendrierEfm />,
      },
      // {
      //   path: "updateModuleStatu", // `/app/updateModuleStatu`
      //   element: <UpdateModuleStatu />,
      // },
      // {

      //   path: "detailsAvencemnet", // `/app/detailsAvencemnet`
      //   element: <DetailsAvencemnet />,
      // },
    ],
  },

  // 404 Page (no layout)
  {
    path: "*",
    element: <PageNotFound />,
  },
]);