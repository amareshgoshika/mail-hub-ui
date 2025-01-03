import React from 'react';

function Welcome() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Container for Welcome and Tabs */}
      <div className="absolute top-4 left-4 flex items-center space-x-12">
        {/* Welcome text */}
        <h1 className="text-4xl font-bold text-blue-600 underline">
          Mail Hub
        </h1>
        
        {/* Tabs with circle format */}
        <div className="flex space-x-8">
          <button className="bg-blue-600 text-white py-3 px-4 rounded-full text-2xl font-bold hover:bg-blue-700">
            Home
          </button>
          <button className="bg-blue-600 text-white py-3 px-4 rounded-full text-2xl font-bold hover:bg-blue-700">
            Features
          </button>
          <button className="bg-blue-600 text-white py-3 px-4 rounded-full text-2xl font-bold hover:bg-blue-700">
            Help
          </button>
          <button className="bg-blue-600 text-white py-3 px-4 rounded-full text-2xl font-bold hover:bg-blue-700">
            Contact
          </button>
        </div>
      </div>

      {/* About Us Section */}
      <section className="max-w-4xl p-8 mt-16 text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-700">
          We are a team dedicated to simplifying your email communication. Our app
          enables you to send bulk, personalized emails directly from your Gmail account,
          saving you time and effort in reaching out to your audience. Whether you're
          sending invitations, updates, or marketing emails, we provide a seamless
          solution that makes your workflow more efficient.
        </p>
      </section>

      {/* Login Form Section */}
      <div className="absolute top-20 right-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
