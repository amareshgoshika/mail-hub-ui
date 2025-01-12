import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

const MailFormats = () => {
  const [mailFormats, setMailFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formatName, setFormatName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setUserEmail(senderEmail);
    } else {
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

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    setFormatName(format.formatName);
    setSubject(format.subject);
    setBody(format.body);
  };

  const handleUpdate = async () => {
    if (!selectedFormat) return;
    const updatedMailFormat = {
      formatName,
      subject,
      body,
      userEmail,
    };

    try {
      const response = await fetch(process.env.REACT_APP_MAIL_FORMAT_UPDATE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMailFormat),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Mail format updated successfully!");
        setSelectedFormat(null);
        setFormatName("");
        setSubject("");
        setBody("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating mail format:", error);
      alert("Failed to update mail format.");
    }
  };

  const handleDelete = async () => {
    if (!selectedFormat) return;
  
    const id = selectedFormat.id;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DELETE_MAIL_FORMATS_URL}?id=${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(process.env.REACT_APP_DELETE_MAIL_FORMATS_URL);
  
      if (response.ok) {
        alert("Mail format deleted successfully!");
        setMailFormats(mailFormats.filter((format) => format.id !== id));
        setSelectedFormat(null);
        setFormatName("");
        setSubject("");
        setBody("");
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting mail format:", error);
      alert("Failed to delete mail format.");
    }
  };  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="w-1/3 bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Mail Formats</h2>
        <div className="mb-4">
          <button
            onClick={() => setSelectedFormat(null)}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Create New Format
          </button>
        </div>

        <div className="space-y-4">
            {mailFormats.map((format) => (
                <div
                key={format.id}
                onClick={() => handleFormatSelect(format)}
                className={`flex justify-between items-center cursor-pointer px-4 py-2 rounded-md border ${
                    selectedFormat?.id === format.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300"
                } hover:border-blue-500`}
                >
                <label
                    htmlFor={format.id}
                    className={`block text-sm ${
                    selectedFormat?.id === format.id ? "text-blue-600" : "text-gray-700"
                    }`}
                >
                    {format.formatName}
                </label>
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(format.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete"
                >
                    {/* Example Delete Icon */}
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
                </div>
            ))}
        </div>
      </div>

      <div className="w-2/3 bg-white p-6 shadow-md rounded-md">
        {selectedFormat && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Mail Format</h2>
            <form>
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

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Body
                </label>
                <div className="rounded-md overflow-hidden border" style={{ minHeight: '250px' }}>
                  <ReactQuill
                    value={body}
                    onChange={setBody}
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
                    style={{
                      minHeight: '250px',
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MailFormats;
