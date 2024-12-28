import React from 'react';

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-100 text-black shadow-md z-50">
      <div className="container mx-auto px-4 py-3 text-center">
        <h1 className="text-4xl font-serif italic font-semibold">Mail Hub</h1>
      </div>
    </header>
  );
}

export default Header;
