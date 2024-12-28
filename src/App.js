import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
import UploadCredentialsInfo from './components/UploadCredentialsInfo';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<UserRegistration />} />
      <Route path="/upload-credentials-info" element={<UploadCredentialsInfo />} />
    </Routes>
  );
}

export default App;
