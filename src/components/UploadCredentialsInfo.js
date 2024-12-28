import React from 'react';

function UploadCredentialsInfo() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Upload Credentials Info</h2>
        <p className="text-gray-700">
          Here you can find information about how to upload your credentials JSON file. Ensure the file contains the necessary permissions for authentication.
        </p>
      </div>
    </div>
  );
}

export default UploadCredentialsInfo;
