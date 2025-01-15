import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
              <img 
              src= {logo}
              alt="MailEasy Logo" 
              className="w-9 h-9 object-contain" 
            />
            <span className="text-2xl font-bold text-gray-800">MailEasy</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}