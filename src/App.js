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
import MailFormats from "./components/MailFormats";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
      <div className="min-h-screen bg-white pt-20 ">
        <Navbar />
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<UserRegistration />} />
      <Route path="/home" element={<Home />} />
      <Route path="/sendEmail" element={<SendEmail />} />
      <Route path="/mailformats" element={<MailFormats />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
