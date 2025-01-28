// ResetPassword.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token');
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', { token, newPassword });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login'); // Redirect to login after successful reset
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  return (
      <div className="min-h-screen flex items-start justify-center px-4">
      <div className="max-w-md w-full bg-white p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Reset Password</h2>
        {tokenValid ? (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <User className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Enter password"
                    />
                </div>
                </div>

                <div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <Mail className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    <input
                    type="password"
                    id="confirmPassword"    
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Confirm Password"
                    required
                    />
                </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Reset Password
                </button>
            </form>
        ) : (
            <p style={{ color: 'red' }}>{error}</p>
        )}

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && !message && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
