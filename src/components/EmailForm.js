import React, { useState } from "react";
import axios from "axios";

// Inline CSS in a single template string:
const inlineStyles = `
/* Reset & body style */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #1a1f36;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Ubuntu, sans-serif;
}
body {
  background-color: #f3f4f6; /* Light gray background */
}

/* Main container (similar to the login page root) */
.sendEmail-root {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Content area (similar structure to login-content) */
.sendEmail-content {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 40px;
  background: #fff;
  box-shadow:
    rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
    rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

/* Page title area */
.sendEmail-title {
  text-align: center;
  margin-bottom: 24px;
}
.sendEmail-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}
.sendEmail-title p {
  color: #697386;
  font-size: 14px;
}

/* Two-column container for forms */
.forms-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@media (min-width: 768px) {
  .forms-container {
    flex-direction: row;
  }
}

/* Each form box (similar to .formbg) */
.form-box {
  flex: 1;
  border-radius: 4px;
  background-color: #f9fafc;
  padding: 16px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
}

/* Form heading inside the box */
.form-box h2 {
  margin-bottom: 16px;
  font-size: 18px;
  text-align: center;
  color: #333;
  font-weight: 600;
}

/* Field spacing */
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}
.field input[type="text"],
.field input[type="email"],
.field input[type="file"],
.field textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e3e8ee;
  border-radius: 4px;
  outline-color: rgba(84, 105, 212, 0.5);
}

/* Buttons */
.button-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 16px;
}
button {
  background-color: #5469d4;
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  transition: background-color 0.2s ease-in-out;
}
button:hover {
  background-color: #4458b3;
}

/* Full-width button on smaller screens */
.submit-button {
  width: 100%;
  margin-top: 16px;
}
`;

function EmailForm() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    subject: "",
    emailBody: "",
  });

  const [credentials, setCredentials] = useState(null);
  const [attachment, setAttachment] = useState(null);

  // ============ EVENT HANDLERS ============= //
  const handleAuth = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_AUTHENTICATE_URL);
      const authUrl = response.data.authUrl;
      window.location.href = authUrl;
    } catch (error) {
      alert("Error initiating authentication: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === "credentials") {
      setCredentials(e.target.files[0]);
    } else if (e.target.name === "attachment") {
      setAttachment(e.target.files[0]);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!credentials) {
      alert("Please select a credentials file first.");
      return;
    }
    const formDataLocal = new FormData();
    formDataLocal.append("credentials", credentials);

    try {
      const response = await axios.post(
        process.env.REACT_APP_UPLOAD_CREDENTIAL_URL,
        formDataLocal
      );
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials) {
      alert("Please upload credentials first.");
      return;
    }

    const form = new FormData();
    form.append("credentials", credentials);
    form.append("attachment", attachment);
    form.append("recipientName", formData.recipientName);
    form.append("recipientEmail", formData.recipientEmail);
    form.append("subject", formData.subject);
    form.append("emailBody", formData.emailBody);

    try {
      const response = await axios.post(
        process.env.REACT_APP_SENDEMAIL_URL,
        form
      );
      alert(response.data.message);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  // ============ RENDER ============= //
  return (
    <>
      {/* Inline styles injected */}
      <style>{inlineStyles}</style>

      <div className="sendEmail-root">
        <div className="sendEmail-content">
          {/* Page Title */}
          <div className="sendEmail-title">
            <h1>Email Manager</h1>
            <p>Upload credentials and send emails with attachments</p>
          </div>

          {/* Two side-by-side forms */}
          <div className="forms-container">
            {/* Upload Credentials Form */}
            <form onSubmit={handleFileSubmit} className="form-box">
              <h2>Upload Credentials</h2>

              <div className="field">
                <label>Credentials JSON</label>
                <input
                  type="file"
                  name="credentials"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div className="button-row">
                <button type="submit">Upload</button>
                <button type="button" onClick={handleAuth}>
                  Authenticate
                </button>
              </div>
            </form>

            {/* Send Email Form */}
            <form onSubmit={handleSubmit} className="form-box">
              <h2>Send Email</h2>

              <div className="field">
                <label>Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label>Recipient Email</label>
                <input
                  type="email"
                  name="recipientEmail"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label>Email Body</label>
                <textarea
                  name="emailBody"
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="field">
                <label>Attachment</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Send Email
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailForm;
