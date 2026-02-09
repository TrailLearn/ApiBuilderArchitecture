import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

import Login from "./pages/auth/Login.tsx";
import Landing from "./pages/Landing.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import ReviewScholarship from "./pages/admin/ReviewScholarship.tsx";
import AdminRoute from "./components/auth/AdminRoute.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider><App /></AuthProvider>,
    children: [
      { path: "", element: <Landing /> }, // Landing page as default
      { path: "login", element: <Login /> },
      {
        element: <AdminRoute />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
          { path: "admin/review/:id", element: <ReviewScholarship /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);