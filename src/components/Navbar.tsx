import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-accent">
            Tiaohai
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`text-sm font-medium ${
                isActive('/menu') ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              Menu
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 