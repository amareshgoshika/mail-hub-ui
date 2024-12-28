import React, { useState } from 'react';
import axios from 'axios';

function EmailForm() {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    subject: '',
    emailBody: '',
  });

  const [credentials, setCredentials] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const handleAuth = async () => {
    try {
      const response = await axios.get('http://localhost:8000/authenticate');
      const authUrl = response.data.authUrl;
      window.location.href = authUrl;
    } catch (error) {
      alert('Error initiating authentication: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'credentials') {
      setCredentials(e.target.files[0]);
    } else if (e.target.name === 'attachment') {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('credentials', credentials);
    form.append('attachment', attachment);
    form.append('recipientName', formData.recipientName);
    form.append('recipientEmail', formData.recipientEmail);
    form.append('subject', formData.subject);
    form.append('emailBody', formData.emailBody);

    console.log('FormData:', form);

    try {
      const response = await axios.post('http://localhost:8000/send-email', form);
      console.log('Recipient:', formData.recipientEmail);
      console.log('Subject:', formData.subject);
      console.log('Body:', formData.emailBody);
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response.data.error}`);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('credentials', credentials);

    try {
      const response = await axios.post('http://localhost:8000/upload-credentials', formData);
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response.data.error}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Upload Credentials Form */}
        <form onSubmit={handleFileSubmit} className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Upload Credentials</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Credentials JSON:</label>
            <input 
              type="file" 
              name="credentials" 
              onChange={handleFileChange} 
              required 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Upload Credentials
            </button>
            <button 
              type="button" 
              onClick={handleAuth} 
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Authenticate Gmail
            </button>
          </div>
        </form>

        {/* Send Email Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">Send Email</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Recipient Name:</label>
            <input 
              type="text" 
              name="recipientName" 
              onChange={handleInputChange} 
              required 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Recipient Email:</label>
            <input 
              type="email" 
              name="recipientEmail" 
              onChange={handleInputChange} 
              required 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Subject:</label>
            <input 
              type="text" 
              name="subject" 
              onChange={handleInputChange} 
              required 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email Body:</label>
            <textarea 
              name="emailBody" 
              onChange={handleInputChange} 
              required 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Attachment:</label>
            <input 
              type="file" 
              name="attachment" 
              onChange={handleFileChange} 
              required 
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailForm;
