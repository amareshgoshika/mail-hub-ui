import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CredentialGenerate() {
  const [credentials, setCredentials] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
  });

  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: senderEmail,
      }));
    }
  }, []);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "credentials") {
      setCredentials(e.target.files[0]);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("credentials", credentials);
    formDataToSubmit.append("email", formData.email);

    try {
      const response = await axios.post(
        process.env.REACT_APP_UPLOAD_CREDENTIAL_URL,
        formDataToSubmit
      );
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response.data.error}`);
    }
  };

  const handleAuth = async () => {
    const email = formData.email;
    try {
      const response = await axios.post(
        process.env.REACT_APP_AUTHENTICATE_URL,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "json",
        }
      );
      const authUrl = response.data.authUrl;
      window.location.href = authUrl;
    } catch (error) {
      alert("Error initiating authentication: " + error.message);
    }
  };

  const handleInfoClick = () => {
    navigate("/upload-credentials-info");
  };

  return (
    <div className="min-h-screen items-center bg-white px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Generate Token
        </h2>
        <form>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your email"
            />
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">
                Upload Credentials
              </label>
              <button
                type="button"
                onClick={handleInfoClick}
                className="text-sm text-blue-600 hover:underline"
              >
                What is Credential file?
              </button>
            </div>
            <input
              type="file"
              name="credentials"
              onChange={handleFileChange}
              required
              className="w-full mt-2 px-2 py-2 border rounded-md focus:outline-none"
            />
            <button
              type="button"
              onClick={handleFileSubmit}
              className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Upload
            </button>
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={handleAuth}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Generate Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CredentialGenerate;
