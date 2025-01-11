import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SendEmail from "../components/SendEmail";
import CredentialGenerate from "../components/CredentialGenerate";
import AccountPage from "../components/AccountPage";

const UserDashboard = () => {
  const [currentPage, setCurrentPage] = useState("SendEmail");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail === "null") {
      alert("Please login to continue");
      navigate("/login"); 
    }
  }, [navigate]);

  const pageComponents = {
    SendEmail: <SendEmail />,
    GenerateCredential: <CredentialGenerate />,
    Account: <AccountPage />,
  };

  const handleLogout = () => {
    localStorage.setItem("userEmail", null);
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      <nav
        className={`fixed inset-y-0 left-0 z-50 transform bg-gray-800 text-white w-64 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 bg-gray-900 text-center text-lg font-bold uppercase">
          MailHUb
        </div>

        <ul className="space-y-4 p-4">
          {Object.keys(pageComponents).map((page) => (
            <li
              key={page}
              className={`cursor-pointer p-2 rounded-md ${
                currentPage === page ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setCurrentPage(page);
                setIsSidebarOpen(false);
              }}
            >
              {page}
            </li>
          ))}
        </ul>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 ml-0 lg:ml-64 p-8 bg-gray-100">
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

        {pageComponents[currentPage]}
      </main>
    </div>
  );
};

export default UserDashboard;
