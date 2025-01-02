import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SendEmail() {
  const navigate = useNavigate();
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mailFormats, setMailFormats] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const senderEmail = localStorage.getItem('userEmail');
    
    if (senderEmail) {
      setUserEmail(senderEmail); 
    } else {
      window.location.href = '/login';
    }
    const fetchMailFormats = async () => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_GET_MAIL_FORMATS_URL}?email=${senderEmail}`);
          setMailFormats(response.data);
      } catch (error) {
          console.error('Error fetching mail formats:', error);
      }
  };

  fetchMailFormats();
  }, []);

    const handleFileChange = (e) => {
        setAttachments(e.target.files);
    };

    const handleSendEmail = async () => {
        if (!recipientEmail || !subject || !body) {
            alert('Please fill out all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('recipientEmail', recipientEmail);
        formData.append('subject', subject);
        formData.append('emailBody', body);
        formData.append('userEmail', userEmail);

        // Add attachments
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachment', attachments[i]);
        }

        try {
            const response = await axios.post(process.env.REACT_APP_SENDEMAIL_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Email sent successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email');
        }
    };

    const handleMailFormatSelect = (formatId) => {
      const selectedFormat = mailFormats.find((format) => format.id === formatId);
      if (selectedFormat) {
          setSubject(selectedFormat.subject);
          setBody(selectedFormat.body);
          setSelectedOption(formatId);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 mt-12 flex flex-col md:flex-row">
      {/* Left Side: Add Recipients Details */}
      <div className="bg-white shadow-md rounded-md p-4 md:w-1/2 mb-4 md:mb-0 md:mr-4">
        <h2 className="text-xl font-bold mb-4">Add Recipient Details</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter recipient name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter recipient email"
            />
          </div>
          <button
            type="button"
            onClick={handleSendEmail}
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-md p-4 md:w-1/2">
        <h2 className="text-xl font-bold mb-4">Mail Contents</h2>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Choose an Option:</label>
            {mailFormats.map((format) => (
                <label key={format.id} className="flex items-center mb-2">
                    <input
                        type="radio"
                        name="mailOption"
                        value={format.id}
                        checked={selectedOption === format.id}
                        onChange={() => handleMailFormatSelect(format.id)}
                        className="mr-2"
                    />
                    {format.formatName}
                </label>
            ))}
        </div>

        <form>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="subject">
                    Mail Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter subject"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="body">
                    Mail Body
                </label>
                <textarea
                    id="body"
                    rows="6"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter email body"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="attachments">
                    Attachments
                </label>
                <input
                    type="file"
                    id="attachments"
                    multiple
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                />
            </div>
        </form>
        <button
          type="button"
            onClick={() => navigate('/newMailFormat')}
          className="w-full bg-blue-500 text-white font-bold py-2 mt-4 rounded-md hover:bg-blue-600"
        >
          Add Mail Format
        </button>
      </div>
    </div>
  );
}

export default SendEmail;
