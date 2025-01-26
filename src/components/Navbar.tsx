import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                POLARITY <span className="text-blue-600">Scanner</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/blocks" className="text-gray-600 hover:text-gray-900">Blocks</Link>
              <Link to="/transactions" className="text-gray-600 hover:text-gray-900">Transactions</Link>
              <Link to="/tokens" className="text-gray-600 hover:text-gray-900">Tokens</Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Address / Txn Hash / Block"
                className="w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;