import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Mail className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">MailEasy</span>
          </Link>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}