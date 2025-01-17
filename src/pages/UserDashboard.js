import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SendEmail from "../components/SendEmail";
import CredentialGenerate from "../components/CredentialGenerate";
import AccountPage from "../components/AccountPage";
import MailFormats from "../components/MailFormats";
import { Mail, Key, FileText, Users, CreditCard, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const [currentPage, setCurrentPage] = useState("SendEmail");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageComponents = useMemo(() => ({
    SendEmail: <SendEmail />,
    GenerateCredential: <CredentialGenerate />,
    MailFormats: <MailFormats setCurrentPage={setCurrentPage} />,
    Account: <AccountPage />,
  }), []);

  const tabIcons = {
    SendEmail: <Mail />,
    GenerateCredential: <Key />,
    MailFormats: <FileText />,
    Account: <Users />,
    Credits: <CreditCard />,
    Logout: <LogOut />,
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail === "null") {
      alert("Please login to continue");
      navigate("/home"); 
    }

    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && pageComponents[tab]) {
      setCurrentPage(tab);
    }

  }, [navigate, location, pageComponents]);

  const handleLogout = () => {
    localStorage.setItem("userEmail", null);
    navigate("/home");
  };

  const handleTabClick = (page) => {
    setCurrentPage(page);
    navigate(`/?tab=${page}`);
  };

  const renderCurrentPage = () => {
    return pageComponents[currentPage];
  };

  return (
    <div className="flex h-screen">
      <nav
        className={`fixed inset-y-0 left-0 z-50 mt-20 transform bg-white/80 text-black w-64 transition-transform h-screen overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <ul className="space-y-4 p-4">
          {Object.keys(pageComponents).map((page) => (
            <li
              key={page}
              className={`cursor-pointer p-2 rounded-md ${
                currentPage === page ? "bg-gray-200" : "hover:bg-gray-300"
              }`}
              onClick={() => handleTabClick(page)}
            >
            <span className="flex items-center">
              <span className="mr-2">{tabIcons[page]}</span>
              {page}
            </span>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
          >
              <span className="flex items-center">
              <span className="mr-2">{tabIcons['Logout']}</span>
              Logout
            </span>
          </button>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 ml-0 lg:ml-64 bg-gray-100">
        <button
          className="p-2 text-gray-800 bg-gray-200 rounded-md lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default UserDashboard;
