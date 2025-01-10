import React, { useState } from "react";
import axios from "axios";

function EmailFormFirst() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    subject: "",
    emailBody: "",
  });
  const [credentials, setCredentials] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const handleAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8000/authenticate");
      const authUrl = response.data.authUrl;
      window.location.href = authUrl;
    } catch (error) {
      alert("Error initiating authentication: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "credentials") {
      setCredentials(e.target.files[0]);
    } else if (e.target.name === "attachment") {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("credentials", credentials);
    form.append("attachment", attachment);
    form.append("recipientName", formData.recipientName);
    form.append("recipientEmail", formData.recipientEmail);
    form.append("subject", formData.subject);
    form.append("emailBody", formData.emailBody);

    try {
      const response = await axios.post(
        "http://localhost:8000/send-email",
        form
      );
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response.data.error}`);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formDataLocal = new FormData();
    formDataLocal.append("credentials", credentials);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-credentials",
        formDataLocal
      );
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response.data.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md shadow-md rounded-md p-6">
        <form onSubmit={handleFileSubmit} className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            Upload Credentials
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Credentials JSON</label>
            <input
              type="file"
              name="credentials"
              onChange={handleFileChange}
              required
              className="w-full px-2 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Upload Credentials
            </button>
            <button
              type="button"
              onClick={handleAuth}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Authenticate Gmail
            </button>
          </div>
        </form>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">Send Email</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Recipient Name</label>
            <input
              type="text"
              name="recipientName"
              onChange={handleInputChange}
              required
              className="w-full px-2 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Recipient Email</label>
            <input
              type="email"
              name="recipientEmail"
              onChange={handleInputChange}
              required
              className="w-full px-2 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              onChange={handleInputChange}
              required
              className="w-full px-2 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email Body</label>
            <textarea
              name="emailBody"
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-2 py-2 border rounded-md"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Attachment</label>
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              required
              className="w-full px-2 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailFormFirst;
