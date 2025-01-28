import React from "react";
import credentialsImage from "../assets/credentials.png";
import createProject from "../assets/createProject.png";
import newProject from "../assets/newProject.png";
import projectName from "../assets/projectName.png";
import oAuthScreen from "../assets/oAuthScreen.png";
import publishApp from "../assets/publishApp.png";

function UploadCredentialsInfo() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          How to Download Your Google Credentials JSON
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          To authenticate your application with Google services, you need to
          download a credentials JSON file from the Google Cloud Console. Follow
          the steps below:
        </p>

        <div className="mb-6">
          <iframe
            className="w-full h-64 rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/2ouy8oE57D8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <ol className="list-decimal list-inside text-gray-800 space-y-4">
          <li>
            Visit the{" "}
            <a
              href="https://console.cloud.google.com/"
              className="text-blue-600 underline"
            >
              Google Cloud Console
            </a>
            .
          </li>
          <li>Select your project or create a new one.</li>
          <li>Search for Gmail API and enable it </li>
          <li>
            Navigate to the{" "}
            <a
              href="https://console.cloud.google.com/apis/credentials"
              className="text-blue-600 underline"
            >
              Credentials
            </a>{" "}
            page.
          </li>

          <div className="mt-6 text-center">
            <img
              src={credentialsImage}
              alt="Google Cloud Console"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <li>Click on the projects.</li>

          <div className="mt-6 text-center">
            <img
              src={createProject}
              alt="Create Project"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <li>Click on the new project.</li>

          <div className="mt-6 text-center">
            <img
              src={newProject}
              alt="New Project"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <li>Create a Project and select it from the projects.</li>

          <div className="mt-6 text-center">
            <img
              src={projectName}
              alt="Project Name"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <li>
            Go to OAuth Consent Screen and create one.
            <ol className="list-disc list-inside ml-4 text-sm text-gray-700">
              <li>App name: mailhub</li>
              <li>User Support email: Select your email</li>
              <li>Developer Email address: Your email</li>
              <li>
                Save and Continue until you create OAuth consent and go to
                Dashboard
              </li>
            </ol>
          </li>

          <div className="mt-6 text-center">
            <img
              src={oAuthScreen}
              alt="OAuth Screen"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <li>Now Publish the App.</li>

          <div className="mt-6 text-center">
            <img
              src={publishApp}
              alt="Publish App"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <li>Go to Credentials → Create credentials → OAuth Client ID.</li>
          <li>Application Type: Web Application.</li>
          <li>
            Authorized redirect URIs → Add URL →
            <ul className="list-disc pl-6 mt-2">
              <li>
                <code className="bg-gray-100 rounded px-1">
                  https://mail-hub-api.onrender.com/callback
                </code>
              </li>
              <li>
                <code className="bg-gray-100 rounded px-1">
                  https://mailhub-api.netlify.app/
                </code>
              </li>
            </ul>
            </li>
            <li>Create and Download JSON.</li>

        </ol>
      </div>
    </div>
  );
}

export default UploadCredentialsInfo;
