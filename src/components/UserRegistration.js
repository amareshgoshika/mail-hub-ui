import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserRegistration() {
  const [credentials, setCredentials] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSubmit = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };
  
    try {
      const response = await axios.post(process.env.REACT_APP_REGISTER_URL, dataToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Registration successful:', response.data);
      alert('User registered successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'credentials') {
      setCredentials(e.target.files[0]);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('credentials', credentials);
    formDataToSubmit.append('email', formData.email);

    try {
      const response = await axios.post(process.env.REACT_APP_UPLOAD_CREDENTIAL_URL, formDataToSubmit);
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response.data.error}`);
    }
  };

  const handleAuth = async () => {
    const email = formData.email;
    try {
      const response = await axios.post(process.env.REACT_APP_AUTHENTICATE_URL, 
        { email: email }, 
        {
          headers: { 'Content-Type': 'application/json' }, 
          responseType: 'json' 
        }
      );
        const authUrl = response.data.authUrl;
        window.location.href = authUrl;
  
    } catch (error) {
      alert('Error initiating authentication: ' + error.message);
    }
  };
  
  

  const handleInfoClick = () => {
    navigate('/upload-credentials-info');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">User Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Upload Credentials File</label>
              <button
                type="button"
                onClick={handleInfoClick}
                className="text-blue-500 underline text-sm"
              >
                Info
              </button>
            </div>
            
            {/* File Input for Credentials */}
            <input 
              type="file" 
              name="credentials" 
              onChange={handleFileChange} 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              required
            />
            
            {/* Upload Button */}
            <button
              type="button"
              onClick={handleFileSubmit}
              className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Upload
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
                onClick={handleAuth}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Generate Token
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserRegistration;
