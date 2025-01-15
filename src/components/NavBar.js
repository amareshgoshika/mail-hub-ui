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
        </div>
      </div>
    </nav>
  );
}