import React from 'react';

function Welcome() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">
          Welcome to Our Homepage!
        </h1>
        <p className="text-gray-700 text-center">
          We are glad to have you here. Explore our features and enjoy your stay.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
