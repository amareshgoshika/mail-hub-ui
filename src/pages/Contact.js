import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !userEmail || !emailBody) {
      setError('All fields are required.');
      return;
    }

    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/home/send-contact-us-email`, {
            subject: name,
            userEmail,
            emailBody,
            });

      setSuccessMessage('Email sent successfully');
      setError('');
    } catch (err) {
      setError('Error sending email');
      setSuccessMessage('');
    }
  };

  return (
    <div className="p-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <h3 className="text-xl text-gray-600 mb-6 text-center">
        We'd love to hear from you. Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
      </h3>
      
      {/* Error or Success message */}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          className="w-full sm:w-1/3 p-2 border rounded mb-2 sm:mb-0"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full sm:w-1/3 p-2 border rounded mb-2 sm:mb-0"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        
        {/* Message Textarea */}
        <input
          placeholder="Your message"
          className="w-full sm:w-1/3 p-2 border rounded mb-2 sm:mb-0"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
        />
        
        {/* Send Button */}
        <button type="submit" className="w-full sm:w-1/3 p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
