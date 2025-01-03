import React from 'react';
import credentialsImage from '../assets/credentials.png';
import createProject from '../assets/createProject.png';
import newProject from '../assets/newProject.png';
import projectName from '../assets/projectName.png';
import oAuthScreen from '../assets/oAuthScreen.png';
import publishApp from '../assets/publishApp.png';

function UploadCredentialsInfo() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6">
        <h2 className="text-3xl font-bold text-center mb-4">How to Download Your Google Credentials JSON File</h2>
        
        <p className="text-lg text-gray-700 mb-4">
          To authenticate your application with Google services, you need to download a credentials JSON file from the Google Cloud Console. Follow the steps below:
        </p>

        <ol className="list-decimal pl-6 text-lg text-gray-700">

          <li>
            Visit the <a href="https://console.cloud.google.com/" className="text-blue-500">Google Cloud Console</a>.
          </li>

          <li>
            Select your project or create a new one.
          </li>

          <li>
            Navigate to the <a href="https://console.cloud.google.com/apis/credentials" className="text-blue-500">Credentials</a> page.
          </li>

          <div className="mt-6 text-center">
            <img src={credentialsImage} alt="Google Cloud Console" className="mx-auto rounded-lg shadow-lg" />
          </div>
        
          <li>
            Click on the projects.
          </li>

          <div className="mt-6 text-center">
            <img src={createProject} alt="Google Cloud Console" className="mx-auto rounded-lg shadow-lg" />
          </div>
        
          <li>
            Click on the new project.
          </li>

          <div className="mt-6 text-center">
            <img src={newProject} alt="Google Cloud Console" className="mx-auto rounded-lg shadow-lg" />
          </div>
        
          <li>
            Create a Project and select it from the projects
          </li>

          <div className="mt-6 text-center">
            <img src={projectName} alt="Google Cloud Console" className="mx-auto rounded-lg shadow-lg" />
          </div>
        
        <li>
          Go to OAuth Consent Screen and create one.
          <ol><li>App name: mailhub</li>
          <li>User Support email: Select your email from the list</li>
          <li>Developer Email address: Give your email</li>
          <li>Save and Continue till you create OAuth consent and Go to Dashboard</li>
          </ol>
        </li>

        <div className="mt-6 text-center">
          <img src={oAuthScreen} alt="Google Cloud Console" className="mx-auto rounded-lg shadow-lg" />
        </div>
        
        <li>
          Now Publish the App
        </li>

        <div className="mt-6 text-center">
          <img src={publishApp} alt="Google Cloud Console" className="mx-auto rounded-lg shadow-lg" />
        </div>
        
        <li>
          Go to Credentials &#8594; create credentials &#8594; OAuth Client ID
        </li>
        
        <li>
          Application Type : Web Application
        </li>

        <li>
          Authorized redirect URIs &#8594; Add URL &#8594; "https://mail-hub-api.onrender.com/callback" &#8594; Create and Download JSON
        </li>
        </ol>

      </div>
    </div>
  );
}

export default UploadCredentialsInfo;
