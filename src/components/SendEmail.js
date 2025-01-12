import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


/**
 * Inline CSS for a cleaner, more minimal UI.
 */
const inlineStyles = `
/* RESET & BASE */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
    "Helvetica Neue", Ubuntu, sans-serif;
}

/* Light vs. Dark top-level containers */
.light-body,
.dark-body {
  min-height: 100vh;
  position: relative;
  width: 100%;
}

/* Light background vs. Dark background */
.light-body {
  background: linear-gradient(to right, #f3f4f6, #e9ecf3);
}
.dark-body {
  background: #1f2937;
}

/* Bubble container (same style as your Welcome/Login) */
.bubble-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* Bubble styling */
.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}
.bubble1 {
  width: 350px;
  height: 350px;
  background-color: #98c1d9;
  top: -120px;
  left: -120px;
}
.bubble2 {
  width: 200px;
  height: 200px;
  background-color: #f2cc8f;
  bottom: -60px;
  right: -60px;
}
.bubble3 {
  width: 300px;
  height: 300px;
  background-color: #dad7cd;
  top: 30%;
  left: 80%;
  transform: translate(-50%, -50%);
}
.bubble4 {
  width: 300px;
  height: 300px;
  background-color: #bbd0ff;
  bottom: 20%;
  left: -100px;
}
.bubble5 {
  width: 250px;
  height: 250px;
  background-color: #f9c6d4;
  top: 65%;
  right: 10%;
  transform: translateY(-50%);
}

/* Dark/Light Mode Toggle Button */
.darkmode-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  background-color: #5469d4;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  transition: background-color 0.2s ease-in-out, transform 0.3s ease;
  z-index: 999;
}
.darkmode-toggle:hover {
  background-color: #4458b3;
  transform: scale(1.05);
}

/* ======================================
   MAIN SEND-EMAIL CONTAINER
======================================= */
.sendEmail-wrapper {
  position: relative;
  z-index: 1; /* above bubbles */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

/* Outer Card */
.sendEmail-container {
  width: 100%;
  max-width: 1080px;
  background: #fff;
  border-radius: 8px;
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}
.dark-body .sendEmail-container {
  background: #2d3748;  /* Dark mode container */
  color: #f1f5f9;
}

/* Title area */
.sendEmail-title h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
  color: #333;
}
.dark-body .sendEmail-title h2 {
  color: #fff;
}
.sendEmail-title p {
  text-align: center;
  font-size: 15px;
  color: #697386;
  margin-bottom: 0;
}
.dark-body .sendEmail-title p {
  color: #cbd5e1;
}

/* Two-column layout for the forms */
.forms-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}
@media (min-width: 768px) {
  .forms-wrapper {
    flex-direction: row;
  }
}

/* Each column */
.column-card {
  flex: 1;
  background-color: #f9fafc;
  border-radius: 6px;
  padding: 24px;
  border: 1px solid #e2e8f0; /* Subtle border in light mode */
  transition: background-color 0.2s;
}
.column-card h3 {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: #333;
}
.dark-body .column-card {
  background-color: #4a5568;
  border: 1px solid #616b7b; /* Subtle border in dark mode */
}
.dark-body .column-card h3 {
  color: #f1f5f9;
}

/* Form fields */
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}
.field input[type="text"],
.field input[type="email"],
.field textarea {
  width: 100%;
  font-size: 14px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline-color: rgba(84, 105, 212, 0.5);
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}
.field input::placeholder,
.field textarea::placeholder {
  color: #9ca3af; /* Lighter placeholder color */
}
.field textarea {
  resize: vertical;
  min-height: 100px;
}

/* Dark mode for fields */
.dark-body .field label {
  color: #cbd5e1;
}
.dark-body .field input[type="text"],
.dark-body .field input[type="email"],
.dark-body .field textarea {
  background-color: #4a5568;
  border: 1px solid #616b7b;
  color: #f1f5f9;
}

/* Button styling */
.button {
  display: inline-block;
  background-color: #5469d4;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  margin-top: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease-in-out;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
}
.button:hover {
  background-color: #4458b3;
}

/* Secondary button (reset) */
.button-secondary {
  background-color: #e2e8f0;
  color: #333;
  margin-right: 10px;
}
.button-secondary:hover {
  background-color: #cbd5e1;
}

/* OR text */
.or-text {
  text-align: center;
  margin: 20px 0;
  font-size: 13px;
  color: #697386;
}
.dark-body .or-text {
  color: #cbd5e1;
}

/* Progress text */
.progress-text {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}
.dark-body .progress-text {
  color: #f1f5f9;
}

/* File upload styling */
.file-upload {
  display: block;
  text-align: left;
  position: relative;
  font-size: 14px;
  margin-bottom: 16px;
}
.file-select {
  display: flex;
  align-items: center;
  border: 1.5px solid #dce4ec;
  color: #34495e;
  cursor: pointer;
  height: 42px;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}
.dark-body .file-select {
  background-color: #4a5568;
  border-color: #616b7b;
  color: #f1f5f9;
}
.file-select:hover {
  border-color: #34495e;
}
.file-select-button {
  background: #dce4ec;
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 100%;
  font-weight: 600;
}
.dark-body .file-select-button {
  background-color: #2d3748;
  color: #f1f5f9;
}
.file-select-name {
  line-height: 1.4;
  display: inline-block;
  padding: 0 10px;
  width: calc(100% - 100px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-select:hover .file-select-button {
  background: #34495e;
  color: #ffffff;
}
.file-upload.active .file-select {
  border-color: #3fa46a;
}
.file-upload.active .file-select-button {
  background: #3fa46a;
  color: #ffffff;
}
.file-select input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0;
}

/* Select menu (Mail formats) */
.select-menu {
  width: 100%;
  font-size: 14px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
  outline-color: rgba(84, 105, 212, 0.5);
  appearance: none;
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}
.select-menu:hover {
  border-color: #34495e;
}
.select-menu:focus {
  border-color: #5469d4;
  outline: none;
}
.select-menu option {
  background-color: #fff;
  color: #333;
}

/* Dark mode select */
.dark-body .select-menu {
  background-color: #4a5568;
  border: 1px solid #616b7b;
  color: #f1f5f9;
}
`;

/**
 * Main SendEmail component
 */
function SendEmail() {
  const navigate = useNavigate();

  // ========================
  // THEME (DARK/LIGHT MODE)
  // ========================
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      return !prev;
    });
  };

  // ========================
  // CSV & ATTACHMENTS
  // ========================
  const csvInputRef = useRef(null);
  const [csvFileName, setCsvFileName] = useState("No file chosen...");
  const [isCSVActive, setIsCSVActive] = useState(false);

  const attachInputRef = useRef(null);
  const [attachFileNames, setAttachFileNames] = useState("No file chosen...");
  const [isAttachActive, setIsAttachActive] = useState(false);

  // ========================
  // FORM STATES
  // ========================
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

  // ========================
  // FETCH MAIL FORMATS
  // ========================
  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setUserEmail(senderEmail);
    } else {
      // If no userEmail found, redirect to login
      window.location.href = "/login";
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

  // ========================
  // CSV FILE HANDLER
  // ========================
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
        // assume first column is email
        const emails = result.data.map((row) => row[0]);
        setEmailList(emails);
      },
      header: false,
    });
  };

  // ========================
  // ATTACHMENT HANDLER
  // ========================
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

  // ========================
  // SEND EMAILS
  // ========================
  const handleSendEmails = async () => {
    if (!subject || !body) {
      alert("Please fill in both the subject and the body of the email.");
      return;
    }

    // If user manually entered a single email, use that; else use CSV
    const emailsToSend = recipientEmail ? [recipientEmail] : emailList;
    if (emailsToSend.length === 0) {
      alert("No emails found in the CSV or single recipient field.");
      return;
    }

    setSendingProgress({ current: 0, total: emailsToSend.length });

    let successCount = 0;
    let failedEmails = [];
    let creditError = false;

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
          } else {
            failedEmails.push(email);
          }
        } else {
          console.error('Error sending email to', email, error);
          failedEmails.push(email);
        }
      }
    }

    let summaryMessage = `${successCount} email(s) sent successfully.`;
  
    if (failedEmails.length > 0) {
      summaryMessage += `\nFailed to send to the following emails:\n${failedEmails.join(', ')}`;
    }
    
    if (creditError) {
      summaryMessage += `\nStopped due to insufficient credits.`;
    }

    alert(summaryMessage);
    setSendingProgress(null);
    navigate("/dashboard");
  };

  // ========================
  // MAIL FORMAT SELECT
  // ========================
  const handleMailFormatChange = async (e) => {
    const formatId = e.target.value;
    setSelectedOption(formatId);

    // If user selects "no" format, reset subject & body
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

  // ========================
  // RESET FORM
  // ========================
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

  return (
    <>
      {/* Inject the combined styles */}
      <style>{inlineStyles}</style>

      <div className={darkMode ? "dark-body" : "light-body"}>
        {/* Dark/Light Mode Toggle Button */}
        <button className="darkmode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Bubble container behind everything */}
        <div className="bubble-container">
          <div className="bubble bubble1" />
          <div className="bubble bubble2" />
          <div className="bubble bubble3" />
          <div className="bubble bubble4" />
          <div className="bubble bubble5" />
        </div>

        {/* Main wrapper */}
        <div className="sendEmail-wrapper">
          <div className="sendEmail-container">
            {/* Title */}
            <div className="sendEmail-title">
              <h2>Send Emails</h2>
              <p>Compose and send emails with CSV-based recipients</p>
            </div>

            {/* Two-column layout */}
            <div className="forms-wrapper">
              {/* LEFT COLUMN: Recipients & CSV */}
              <div className="column-card">
                <h3>Recipients</h3>

                {/* Single Recipient */}
                <div className="field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient name"
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Recipient email"
                  />
                </div>

                <div className="or-text">OR</div>

                {/* CSV Upload */}
                <label style={{ fontSize: "14px", fontWeight: 600 }}>
                  Upload CSV
                </label>
                <div
                  className={`file-upload ${isCSVActive ? "active" : ""}`}
                  style={{ marginBottom: "16px" }}
                >
                  <div className="file-select">
                    <div className="file-select-button">Choose File</div>
                    <div className="file-select-name">{csvFileName}</div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVFileChange}
                      ref={csvInputRef}
                    />
                  </div>
                </div>
                {/* Buttons & progress */}
                <div style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={handleSendEmails}
                  >
                    Send
                  </button>
                  {sendingProgress && (
                    <div className="progress-text">
                      Sending {sendingProgress.current} of{" "}
                      {sendingProgress.total} emails...
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Email Content */}
              <div className="column-card">
                <h3>Content</h3>

                {/* Mail Format Dropdown */}
                <div className="field">
                  <label>Choose a Mail Format</label>
                  <select
                    value={selectedOption}
                    onChange={handleMailFormatChange}
                    className="select-menu"
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
                <div className="field">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2" htmlFor="body">
                    Mail Body
                </label>
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
                                ['clean'], // Remove formatting
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
          <style>
          {`
            .ql-container {
              border: none !important;
            }
          `}
          </style>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="attachments">
                  Attachments
              </label>
              <div
                className={`file-upload ${isAttachActive ? "active" : ""}`}
                style={{ marginBottom: "16px" }}
              >
                <div className="file-select">
                  <div className="file-select-button">Choose File</div>
                  <div className="file-select-name">{attachFileNames}</div>
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentChange}
                    ref={attachInputRef}
                  />
                </div>
              </div>

              {attachments.length > 0 && (
                <div>
                  <h4>Attachments:</h4>
                  <ul>
                    {attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                className="button"
                onClick={() => navigate("/newMailFormat")}
              >
                Add Mail Format
              </button>
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default SendEmail;
