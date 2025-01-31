import React, { useState} from 'react';
import { Search, RotateCcw, Send, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import Papa from 'papaparse';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('userData');
  const [, setShowLogin] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [, setCsvFileName] = useState("No file chosen...");
  const [, setIsCSVActive] = useState(false);
  const [vendorEmailList, setVendorEmailList] = useState([]);
  const [customerEmailList, setCustomerEmailList] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/admin/admin-login`, {
        email: adminEmail,
        password: adminPassword,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  const handleVendorCSVFileChange = (e) => {
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
        setVendorEmailList(emails);
      },
      header: false,
    });
  };

  const handleCustomerCSVFileChange = (e) => {
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
        setCustomerEmailList(emails);
      },
      header: false,
    });
  };

  const handleVendorEmailsSave = async () => {
    if (!vendorEmailList || vendorEmailList.length === 0) {
      alert("No emails to upload");
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/admin/save-vendor-emails`, {
        emails: vendorEmailList,
      });
  
      if (response.data.success) {
        alert("Emails successfully saved to Firebase!");
      } else {
        alert("Failed to save emails. Please try again.");
      }
    } catch (error) {
      console.error("Error saving emails:", error);
      alert("An error occurred while saving emails.");
    }
  };

  const handleCustomerEmailsSave = async () => {
    if (!customerEmailList || customerEmailList.length === 0) {
      alert("No emails to upload");
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/admin/save-customer-emails`, {
        emails: customerEmailList,
      });
  
      if (response.data.success) {
        alert("Emails successfully saved to Firebase!");
      } else {
        alert("Failed to save emails. Please try again.");
      }
    } catch (error) {
      console.error("Error saving emails:", error);
      alert("An error occurred while saving emails.");
    }
  };

  const handleReset = () => {
    setVendorEmailList([]);
    setCustomerEmailList([]);
    setFileInputKey(Date.now());
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Admin Login</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('userData')}
              className={`${
                activeTab === 'userData'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
            >
              User Data
            </button>
            <button
              onClick={() => setActiveTab('addData')}
              className={`${
                activeTab === 'addData'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
            >
              Add Data
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'userData' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-3">Upload Vendor Emails CSV</h3>
                <div className="space-y-3">
                    <div className="mb-4">
                    <input
                        type="file"
                        key={fileInputKey}
                        id="csvUpload"
                        accept=".csv"
                        onChange={handleVendorCSVFileChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                    </div>
                  <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center px-3 py-1 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </button>
                    <button 
                        onClick={handleVendorEmailsSave}
                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                      <Send className="h-3 w-3 mr-1" />
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-3">Upload Customer Emails CSV</h3>
                <div className="space-y-3">
                    <div className="mb-4">
                    <input
                        type="file"
                        key={fileInputKey}
                        id="csvUpload"
                        accept=".csv"
                        onChange={handleCustomerCSVFileChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                    </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                        onClick={handleReset}
                        className="flex items-center px-3 py-1 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </button>
                    <button 
                        onClick={handleCustomerEmailsSave}
                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                      <Send className="h-3 w-3 mr-1" />
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
