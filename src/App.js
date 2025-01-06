import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
import UploadCredentialsInfo from './components/UploadCredentialsInfo';
import Home from './pages/Home';
import NewMailFormat from './components/NewMailFormat';
import SendEmail from './components/SendEmail';
import CredentialGenerate from './components/CredentialGenerate';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sendEmail" element={<SendEmail />} />
      <Route path="/register" element={<UserRegistration />} />
      <Route path="/upload-credentials-info" element={<UploadCredentialsInfo />} />
      <Route path="/newMailFormat" element={<NewMailFormat />} />
      <Route path="/credentialGenerate" element={<CredentialGenerate />} />
    </Routes>
  );
}

export default App;
