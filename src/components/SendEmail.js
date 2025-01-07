import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';

function SendEmail() {
  const navigate = useNavigate();
  const csvInputRef = useRef(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mailFormats, setMailFormats] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [emailList, setEmailList] = useState([]); 
  const [sendingProgress, setSendingProgress] = useState(null);

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

  const handleCSVFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Assuming the first column contains the email addresses
          const emails = result.data.map((row) => row[0]);
          setEmailList(emails);
        },
        header: false,
      });
    }
  };

  const handleAttachmentChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setAttachments(Array.from(files));
    }
  };

  const handleSendEmails = async () => {

    if (!subject || !body) {
      alert('Please fill in both the subject and the body of the email.');
      return;
    }

    const emailsToSend = recipientEmail ? [recipientEmail] : emailList;

    if (emailsToSend.length === 0) {
      alert('No emails found in the CSV');
      return;
    }

    setSendingProgress({ current: 0, total: emailsToSend.length });

    for (let i = 0; i < emailsToSend.length; i++) {
      const email = emailsToSend[i];
      try {
        // Construct form data for each email
        const formData = new FormData();
        formData.append('recipientEmail', email);
        formData.append('subject', subject);
        formData.append('emailBody', body);
        formData.append('userEmail', userEmail);

        // Add attachments
        for (let i = 0; i < attachments.length; i++) {
          formData.append('attachment', attachments[i]);
        }

        // Send email
        await axios.post(process.env.REACT_APP_SENDEMAIL_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setSendingProgress((prevState) => ({
          current: prevState.current + 1,
          total: prevState.total,
        }));
      alert('Emails sent successfully!');
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400 && error.response.data.message === 'No credits available') {
            alert('You have run out of credits. Please purchase more to continue sending emails.');
          } else {
            alert(`Failed to send email to ${email}. Error: ${error.response.data.message}`);
          }
        } else {
          console.error('Error sending email to', email, error);
          alert(`Unexpected error occurred while sending email to ${email}`);
        }
      }
    }
    setSendingProgress(null);
    navigate('/sendEmail');
  };

    const handleMailFormatSelect = (formatId) => {
      const selectedFormat = mailFormats.find((format) => format.id === formatId);
      if (selectedFormat) {
          setSubject(selectedFormat.subject);
          setBody(selectedFormat.body);
          setSelectedOption(formatId);
      }
  };

  const handleReset = () => {
    setRecipientName('');
    setRecipientEmail('');
    setEmailList([]);
    setAttachments([]);
    if (csvInputRef.current) {
      csvInputRef.current.value = ''; // Reset the CSV input file field
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 mt-12 flex flex-col md:flex-row">
      {/* Left Side: Add Recipients Details */}
      <div className="bg-white shadow-md rounded-md p-4 md:w-1/2 mb-4 md:mb-0 md:mr-4">
      <h2 className="text-xl font-bold mb-4">Add Recipient Details</h2>
      
      <form>
        {/* Manual Entry Fields */}
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

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">OR</span>
        </div>

        {/* CSV Upload Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="csvUpload">
            Upload CSV File
          </label>
          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            onChange={handleCSVFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
            ref={csvInputRef}
          />
          <button
            type="button"
            // onClick={handleFileSubmit}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Upload CSV
          </button>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-gray-300 text-black font-bold py-2 mt-4 rounded-md hover:bg-gray-400"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleSendEmails}
          className="w-full bg-blue-500 text-white font-bold py-2 mt-4  rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {sendingProgress && (
        <div className="mt-4">
          Sending {sendingProgress.current} of {sendingProgress.total} emails...
        </div>
      )}
    </div>

      <div className="bg-white shadow-md rounded-md p-4 md:w-1/2">
        <h2 className="text-xl font-bold mb-4">Mail Contents</h2>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Choose a Mail format</label>
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
                    onChange={handleAttachmentChange}
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
