import React, { useRef, useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

const MailFormats = ({ setCurrentPage }) => {
  const [mailFormats, setMailFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formatName, setFormatName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setUserEmail(senderEmail);
    } else {
      window.location.href = "/login";
    }
    fetchMailFormats(senderEmail);
  }, []);

  const fetchMailFormats = async (senderEmail) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GET_MAIL_FORMATS_URL}?email=${senderEmail}`
      );
      setMailFormats(response.data);
    } catch (error) {
      console.error("Error fetching mail formats:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormatSelect = async (format) => {
    setFormatName(format.formatName);
    setSubject(format.subject);
    setBody(format.body);

    if (format.attachmentURL) {
        try {

          const response = await fetch(format.attachmentURL);
          if (response.ok) {
            const blob = await response.blob();
            const decodedURL = decodeURIComponent(format.attachmentURL);
          
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
    setSelectedFormat(format);
    if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    setIsCreating(false);
  };

  const handleUpdate = async () => {

    if (!formatName || !subject || !body || !userEmail) {
        alert("Please fill in all required fields");
        return;
      }
  
      let fileURL = null;
  
      if (file) {
        try {
          const fileRef = ref(storage, `attachments/${userEmail}/${formatName}/${file.name}`);
          await uploadBytes(fileRef, file);
          fileURL = await getDownloadURL(fileRef);
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Failed to upload attachment.");
          return;
        }
      }

    if (!selectedFormat) return;
    const updatedMailFormat = {
      formatName,
      subject,
      body,
      userEmail,
      attachmentURL: fileURL,
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

  const handleDelete = async (formatToDelete) => {
    if (!formatToDelete) return;
  
    const id = formatToDelete.id;
    const attachementURLFile = formatToDelete.attachmentURL;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DELETE_MAIL_FORMATS_URL}?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attachmentURL: attachementURLFile,
          }),
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
        setAttachments("");
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting mail format:", error);
      alert("Failed to delete mail format.");
    }
  };

  const handleSaveNewFormat = async () => {

    if (!formatName || !subject || !body || !userEmail) {
        alert("Please fill in all required fields");
        return;
      }
  
      let fileURL = null;
  
      if (file) {
        try {
          const fileRef = ref(storage, `attachments/${userEmail}/${formatName}/${file.name}`);
          await uploadBytes(fileRef, file);
          fileURL = await getDownloadURL(fileRef);
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Failed to upload attachment.");
          return;
        }
      }

    const mailFormat = {
        formatName,
        subject,
        body,
        userEmail,
        attachmentURL: fileURL,
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
          fetchMailFormats(userEmail);
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error saving mail format:", error);
        alert("Failed to save mail format.");
      }
    };

  const handleCreateNewFormat = () => {
    setIsCreating(true);
    setFormatName("");
    setSubject("");
    setBody("");
    setAttachments("");
    if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      <div className="lg:w-1/3 w-full bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Mail Formats</h2>
        <div className="mb-4">
            <button
              onClick={handleCreateNewFormat} 
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
                  handleDelete(format);
                }}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete"
              >
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

      <div className="lg:w-2/3 w-full bg-white p-6 shadow-md rounded-md">
        {isCreating ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">New Mail Format</h2>
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

            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Attachment</label>
                <input
                type="file"
                name="attachments"
                onChange={handleFileChange}
                required
                className="w-full px-2 py-2 border rounded-md"
                ref={fileInputRef}
                />
            </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleSaveNewFormat}
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : selectedFormat ? (
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


            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Attachment</label>
                <input
                type="file"
                name="attachments"
                onChange={handleFileChange}
                required
                className="w-full px-2 py-2 border rounded-md"
                ref={fileInputRef}
                />
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

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a mail format to view or edit</p>
        )}
      </div>
    </div>
  );
};

export default MailFormats;
