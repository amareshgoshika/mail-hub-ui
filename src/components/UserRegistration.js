import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserRegistration() {
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

      localStorage.setItem('userEmail', formData.email);
      navigate('/credentialGenerate');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || 'User already registered.');
      } else {
        console.error('Error during registration:', error);
        alert('An error occurred during registration.' + error.message);
      }
    }
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
