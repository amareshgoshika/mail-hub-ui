import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL_HTTPS}/api/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      if (err.response) {
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("An error occurred while processing your request");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="max-w-md w-full bg-white p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
