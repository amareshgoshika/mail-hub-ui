import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Loader } from 'lucide-react';

function SendEmail() {
  const navigate = useNavigate();
  const csvInputRef = useRef(null);
  const [, setCsvFileName] = useState("No file chosen...");
  const [, setIsCSVActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const attachInputRef = useRef(null);
  const [, setAttachFileNames] = useState("No file chosen...");
  const [, setIsAttachActive] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [mailFormats, setMailFormats] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [sendingProgress, setSendingProgress] = useState(null);

  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setUserEmail(senderEmail);
    } else {
      window.location.href = "/home";
    }

    const fetchMailFormats = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GET_MAIL_FORMATS_URL}?email=${senderEmail}`
        );
        setMailFormats(response.data);
      } catch (error) {
        console.error("Error fetching mail formats:", error);
      }
    };
    fetchMailFormats();
  }, []);

  const handleAuth = async () => {
    const email = localStorage.getItem("userEmail");
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

  const handleCSVFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setCsvFileName("No file chosen...");
      setIsCSVActive(false);
      return;
    }
    setCsvFileName(file.name);
    setIsCSVActive(true);

    Papa.parse(file, {
      complete: (result) => {
        const emails = result.data.map((row) => row[0]);
        setEmailList(emails);
      },
      header: false,
    });
  };

  const handleAttachmentChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setAttachFileNames("No file chosen...");
      setIsAttachActive(false);
      return;
    }

    const filesArray = Array.from(files);
    setAttachments(filesArray);

    const allNames = filesArray.map((f) => f.name).join(", ");
    setAttachFileNames(allNames);
    setIsAttachActive(true);
  };

  const handleSendEmails = async () => {
    if (!subject || !body) {
      alert("Please fill in both the subject and the body of the email.");
      return;
    }

    const emailsToSend = recipientEmail ? [recipientEmail] : emailList;
    if (emailsToSend.length === 0) {
      alert("No emails found in the CSV or single recipient field.");
      return;
    }

    setSendingProgress({ current: 0, total: emailsToSend.length });
    setLoading(true);

    let successCount = 0;
    let failedEmails = [];
    let creditError = false;
    let tokenError = false;

    for (let i = 0; i < emailsToSend.length; i++) {
      const email = emailsToSend[i];
      try {
        const formData = new FormData();
        formData.append("recipientEmail", email);
        formData.append("subject", subject);
        formData.append("emailBody", body);
        formData.append("userEmail", userEmail);

        // Attach multiple files
        for (let j = 0; j < attachments.length; j++) {
          formData.append("attachment", attachments[j]);
        }

        await axios.post(process.env.REACT_APP_SENDEMAIL_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setSendingProgress((prev) => ({
          current: prev.current + 1,
          total: prev.total,
        }));
        successCount++;

      } catch (error) {
        if (error.response) {
          if (error.response.status === 400 && error.response.data.message === 'No credits available') {
            creditError = true;
            break;
          } else if (error.response.status === 500) {
            tokenError = true;
            handleAuth();
          } else {
            failedEmails.push(email);
          }
        } else {
          console.error('Error sending email to', email, error);
          failedEmails.push(email);
        }
      }
    }

    let summaryMessage = `Thanks for choosing Maileazy`;

    if (successCount > 0) {
      summaryMessage += `\n${successCount} email(s) sent successfully.`;
    }
  
    if (failedEmails.length > 0) {
      summaryMessage += `\nFailed to send to the following emails:\n${failedEmails.join(', ')}`;
    }
    
    if (creditError) {
      summaryMessage += `\nStopped due to insufficient credits.`;
    }
    
    if (tokenError) {
      summaryMessage += `\nToken was expired, Please authenticate again to continue`;
    }

    alert(summaryMessage);
    setSendingProgress(null);
    setLoading(false);
    navigate("/");
  };

  const handleMailFormatChange = async (e) => {
    const formatId = e.target.value;
    setSelectedOption(formatId);

    if (!formatId) {
      setSubject("");
      setBody("");
      setAttachments([]);
      return;
    }

    const selectedFormat = mailFormats.find(
      (format) => String(format.id) === formatId
    );
    if (selectedFormat) {
      setSubject(selectedFormat.subject);
      setBody(selectedFormat.body);

      if (selectedFormat.attachmentURL) {
        try {

          const response = await fetch(selectedFormat.attachmentURL);
          if (response.ok) {
            const blob = await response.blob();
            const decodedURL = decodeURIComponent(selectedFormat.attachmentURL);
          
            const urlPath = decodedURL.split('?')[0];
            if (urlPath.includes('attachments/')) {
              const fileRelativePath = urlPath.split('attachments/')[1];
              const encodedFileName = fileRelativePath.substring(fileRelativePath.lastIndexOf('/') + 1);
              const decodedFileName = decodeURIComponent(encodedFileName);
              const file = new File([blob], decodedFileName, { type: blob.type });
              setAttachments([file]);
            } else {
              console.error("The URL doesn't contain the expected 'attachments/' path.");
            }
          } else {
            console.error("Failed to fetch attachment");
          }
          
        } catch (error) {
          console.error("Error fetching attachment:", error);
        }
      } else {
        setAttachments([]);
      }
    }
  };

  const handleReset = () => {
    setRecipientName("");
    setRecipientEmail("");
    setSubject("");
    setBody("");
    setEmailList([]);
    setAttachments([]);
    setSelectedOption("");
    setSendingProgress(null);

    // Reset CSV
    setCsvFileName("No file chosen...");
    setIsCSVActive(false);
    if (csvInputRef.current) {
      csvInputRef.current.value = "";
    }

    // Reset attachments
    setAttachFileNames("No file chosen...");
    setIsAttachActive(false);
    if (attachInputRef.current) {
      attachInputRef.current.value = "";
    }
  };

  const handleBodyChange = (value) => {
    setBody(value);
  };

  const handleRewrite = async () => {
    if (!body.trim()) {
      alert("Please enter body to rewrite.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/rewrite/rewrite-api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: body,
          userEmail: userEmail,
         }),
      });

      const data = await response.json();
      if (data.message && data.message === 'No credits available') {
        alert('No credits available');
      } else if (data.rewrittenText) {
        setBody(data.rewrittenText);
      } else {
        alert("Error rewriting the body.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Main wrapper */}
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-md lg:p-4 sm:p-0">
          <div className="lg:mb-4 lg:p-0 p-4">
            <h2 className="text-2xl font-bold text-gray-800">Send Emails</h2>
            <p className="text-gray-600">Compose and send emails with CSV-based recipients</p>
          </div>
  
          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Recipients & CSV */}
            <div className="lg:col-span-1 p-6 bg-gray-50 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Recipients</h3>
  
              {/* Single Recipient */}
              <div className="mb-4">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Recipient email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
  
              <div className="text-center text-gray-500 font-medium mb-4">OR</div>
  
              {/* CSV Upload */}
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
              </div>
  
              {/* Buttons & progress */}
              <div className="flex items-center space-x-4 mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                  onClick={handleSendEmails}
                >
                  {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send
                </>
              )}
                </button>
              </div>
              {sendingProgress && (
                <div className="mt-2 text-sm text-gray-600">
                  Sending {sendingProgress.current} of {sendingProgress.total} emails...
                </div>
              )}
            </div>
  
            {/* RIGHT COLUMN: Email Content */}
            <div className="lg:col-span-2 p-6 bg-gray-50 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Content</h3>
  
              {/* Mail Format Dropdown */}
              <div className="mb-4">
                <select
                  value={selectedOption}
                  onChange={handleMailFormatChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select a Mail Format</option>
                  {mailFormats.map((format) => (
                    <option key={format.id} value={format.id}>
                      {format.formatName}
                    </option>
                  ))}
                </select>
              </div>
  
              {/* Subject */}
              <div className="mb-4">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
  
              {/* Mail Body */}
              <div className="mb-4">
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <ReactQuill
                    value={body}
                    onChange={handleBodyChange}
                    theme="snow"
                    placeholder="Enter email body"
                    modules={{
                      toolbar: [
                        [{ font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['blockquote', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image', 'video'],
                        ['clean'],
                      ],
                    }}
                    formats={[
                      'font',
                      'size',
                      'bold',
                      'italic',
                      'underline',
                      'strike',
                      'color',
                      'background',
                      'align',
                      'blockquote',
                      'code-block',
                      'list',
                      'bullet',
                      'link',
                      'image',
                      'video',
                    ]}
                    className="w-full"
                    style={{ minHeight: '250px' }}
                  />
                </div>
              </div>

              {/* Rewrite Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleRewrite}
                  disabled={loading}
                  className={`px-4 py-2 text-white rounded-md ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {loading ? "Rewriting..." : "Rewrite with AI"}
                </button>
                </div>
  
              {/* Attachments */}
              <div className="mb-4">
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
                {attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Attachments:</h4>
                    <ul className="list-disc pl-5">
                      {attachments.map((file, index) => (
                        <li key={index} className="text-gray-600 text-sm">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
  
                <button
                  type="button"
                  className="px-4 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => navigate('/?tab=MailFormats')}
                >
                  Add Mail Format
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
}

export default SendEmail;
