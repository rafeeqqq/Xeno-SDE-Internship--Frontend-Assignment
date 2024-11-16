import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Dashboard from "./Pages/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { message } from "antd";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <GoogleOAuthProvider clientId="429751468467-a916nkk17vcqj3k8o6jnhm2rmh1j3daq.apps.googleusercontent.com">
              <LoginPage />
            </GoogleOAuthProvider>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardWithAuth />} />
      </Routes>
    </Router>
  );
};

const DashboardWithAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      message.error("Please Login");
    }
  }, [navigate]);

  return <Dashboard />;
};

export default App;
