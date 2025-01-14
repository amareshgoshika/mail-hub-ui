// src/App.js
import React from "react";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import UserRegistration from "./components/UserRegistration";
import UploadCredentialsInfo from "./components/UploadCredentialsInfo";
import SendEmail from "./components/SendEmail";
import CredentialGenerate from "./components/CredentialGenerate";
import UserDashboard from "./pages/UserDashboard";
import Home from "./pages/Home";
import { Navbar } from "./components/NavBar";

function App() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
        <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<UserRegistration />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/sendEmail" element={<SendEmail />} />
      <Route
        path="/upload-credentials-info"
        element={<UploadCredentialsInfo />}
      />
      <Route path="/credentialGenerate" element={<CredentialGenerate />} />
    </Routes>
      </div>
  );
}

export default App;
