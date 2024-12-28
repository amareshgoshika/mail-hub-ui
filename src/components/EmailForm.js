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
    <div>
      <form onSubmit={handleFileSubmit}>
        <h2>Upload Credentials</h2>
        <div>
          <label>Credentials JSON:</label>
          <input type="file" name="credentials" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload Credentials</button>
        <button type="button" onClick={handleAuth}>Authenticate Gmail</button>
      </form>

      <form onSubmit={handleSubmit}>
        <h2>Send Email</h2>
        <div>
          <label>Recipient Name:</label>
          <input type="text" name="recipientName" onChange={handleInputChange} required />
        </div>
        <div>
          <label>Recipient Email:</label>
          <input type="email" name="recipientEmail" onChange={handleInputChange} required />
        </div>
        <div>
          <label>Subject:</label>
          <input type="text" name="subject" onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email Body:</label>
          <textarea name="emailBody" onChange={handleInputChange} required />
        </div>
        <div>
          <label>Attachment:</label>
          <input type="file" name="attachment" onChange={handleFileChange} required />
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
}

export default EmailForm;
