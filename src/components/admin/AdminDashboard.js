import React, { useState, useEffect } from 'react';
import { RotateCcw, Send, LayoutDashboard } from 'lucide-react';
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
  const [benchsalesEmailList, setBenchsalesEmailList] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [searchEmail, setSearchEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [userPaymentsData, setUserPaymentsData] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUserEmails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/admin/list-of-users`);
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching user emails:", err);
            setError("Failed to load user emails.");
        }
    };

    fetchUserEmails();
}, []);

const onSelectUser = (email) => {
    setSearchEmail("");
    setSelectedUser(email);
    handleSearch();
};

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

  const handleBenchsalesCSVFileChange = (e) => {
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
        setBenchsalesEmailList(emails);
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

  const handleBenchsalesEmailsSave = async () => {
    if (!benchsalesEmailList || benchsalesEmailList.length === 0) {
      alert("No emails to upload");
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/admin/save-benchsales-emails`, {
        emails: benchsalesEmailList,
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
    setSearchEmail("");
    setSelectedUser("");
  };

  const handleSearchInputChange = (event) => {
    setSearchEmail(event.target.value);
    setSelectedUser("");
  };

  const handleSearch = async () => {

    const emailToSearch = selectedUser || searchEmail;

    if (!emailToSearch) {
      setError("Please enter an email.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/admin/search-user?email=${encodeURIComponent(emailToSearch)}`);
      const result = await response.json();

      if (!result.success) {
        setUserData(null);
        setError(result.message);
      } else {
        const { createdAt, updatedAt, ...filteredUserData } = result.user;
        const filteredUserPaymentsData = result.userPayments.map(payment => {
            const { createdAt, updatedAt, transactionDate, ...filteredPaymentData } = payment;
            return {
              ...filteredPaymentData,
              transactionDate: transactionDate ? new Date(transactionDate._seconds * 1000).toLocaleString() : '',
              createdAt: createdAt ? new Date(createdAt._seconds * 1000).toLocaleString() : '',
              updatedAt: updatedAt ? new Date(updatedAt._seconds * 1000).toLocaleString() : ''
            };
          });
        setUserData(filteredUserData);
        setUserPaymentsData(filteredUserPaymentsData);
        setError(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Error searching for user.");
    }
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
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchEmail}
                        onChange={handleSearchInputChange}
                        className="w-full pl-8 pr-3 py-1 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-2 bg-indigo-600 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-indigo-700"
                    >
                        Search
                    </button>
                    {error && <p className="mt-2 text-xs md:text-sm text-red-600">{error}</p>}
                </div>
            
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-2 md:p-4">
                    <div className="w-full md:w-1/2 p-2 md:p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-sm md:text-lg font-semibold">User Emails</h3>
                        <ul className="mt-1 md:mt-2 space-y-1 md:space-y-2">
                            {users.map((user) => (
                                <li 
                                    key={user.email} 
                                    className={`cursor-pointer p-1 md:p-2 text-sm md:text-base rounded-lg ${selectedUser === user.email ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
                                    onClick={() => onSelectUser(user.email)}
                                >
                                    {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
            
                    <div className="w-full md:w-1/2 p-2 md:p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-sm md:text-lg font-semibold">User Details</h3>
                        {userData && (
                            <div className="space-y-1 md:space-y-2">
                                {Object.entries(userData).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <label className="text-gray-700 font-medium text-xs md:text-sm uppercase">{key}:</label>
                                        <input
                                            type="text"
                                            value={value}
                                            readOnly
                                            className="w-1/2 p-1 text-xs md:text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            
                <div className="w-full md:w-full p-2 md:p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-sm md:text-lg font-semibold">User Payment Data</h3>
                    {userPaymentsData && userPaymentsData.length > 0 ? (
                        <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                            {Object.keys(userPaymentsData[0]).map((key) => (
                                (key !== "userEmail" && key !== "id") && (
                                <th key={key} className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700 border-b border-gray-300 uppercase">
                                    {key}
                                </th>
                                )
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userPaymentsData.map((payment, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-200">
                                {Object.entries(payment).map(([key, value], colIndex) => (
                                (key !== "userEmail" && key !== "id") && (
                                    <td key={colIndex} className="px-4 py-2 text-xs md:text-sm text-gray-700">
                                    {value}
                                    </td>
                                )
                                ))}
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <p>No payment data available.</p>
                    )}
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

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-3">Upload Benchsales Emails CSV</h3>
                <div className="space-y-3">
                    <div className="mb-4">
                    <input
                        type="file"
                        key={fileInputKey}
                        id="csvUpload"
                        accept=".csv"
                        onChange={handleBenchsalesCSVFileChange}
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
                        onClick={handleBenchsalesEmailsSave}
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
