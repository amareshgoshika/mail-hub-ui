import React, { useState } from "react";

const NewMailFormat = () => {
  const [attachments, setAttachments] = useState([]);
  const [formatName, setFormatName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-md p-4">
        <h2 className="text-xl font-bold mb-4">New Mail Format</h2>
        <form>
          {/* Format Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="formatName">
              Format Name
            </label>
            <input
              type="text"
              id="formatName"
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter format name"
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="subject">
              Subject
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

          {/* Body */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="body">
              Body
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

          {/* Attachments */}
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
            <div className="mt-2 text-sm">
              <p>Selected attachments:</p>
              <ul>
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature */}
          <div className="mb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2" htmlFor="signatureName">
                Signature
              </label>
            <textarea
              id="signature"
              rows="4"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter signature"
            />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewMailFormat;
