import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    credentials: '',
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
      credentials: formData.credentials,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/api/register', dataToSubmit, {
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to application/json
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

  // const handleAuth = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/authenticate');
  //     const authUrl = response.data.authUrl;
  //     window.location.href = authUrl;
  //   } catch (error) {
  //     alert('Error initiating authentication: ' + error.message);
  //   }
  // };
  const handleAuth = async () => {
    try {
      // Step 1: Make the request to your /authenticate route
      const response = await axios.get('http://localhost:8000/authenticate', {
        responseType: 'json' // Expecting JSON response
      });
  
      // Step 2: Extract the authorization URL
      const authUrl = response.data.authUrl;
  
      // Step 3: Redirect the user to the Google OAuth URL to authorize the app
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
              <label className="block text-sm font-medium text-gray-700">Credentials file URL</label>
              <button
                type="button"
                onClick={handleInfoClick}
                className="text-blue-500 underline text-sm"
              >
                Info
              </button>
            </div>
            <input
              type="text"
              name="credentials"
              value={formData.credentials}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
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
