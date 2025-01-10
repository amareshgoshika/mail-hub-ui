import React, { useState, useEffect } from "react";

const NewMailFormat = () => {
  const [attachments, setAttachments] = useState([]);
  const [formatName, setFormatName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setUserEmail(senderEmail);
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSave = async () => {
    const mailFormat = {
      formatName,
      subject,
      body,
      userEmail,
    };

    try {
      const response = await fetch(process.env.REACT_APP_MAIL_FORMAT_SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailFormat),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Mail format saved successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving mail format:", error);
      alert("Failed to save mail format.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">New Mail Format</h2>
        <form>
          {/* Format Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Format Name
            </label>
            <input
              type="text"
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              placeholder="Enter format name"
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              placeholder="Enter subject"
            />
          </div>

          {/* Body */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Body
            </label>
            <textarea
              rows="6"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              placeholder="Enter email body"
            />
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-2 py-2 border rounded-md focus:outline-none"
            />
            {attachments.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Selected attachments:</p>
                <ul>
                  {attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewMailFormat;
