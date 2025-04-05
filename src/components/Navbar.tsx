import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = useOrder();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // 导航后关闭菜单
  };

  return (
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/home" 
            className="text-xl font-bold text-red-500 cursor-pointer"
            onClick={() => handleNavigation('/home')}
          >
            Tiaohai
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => handleNavigation('/home')}
              className={`text-sm font-medium cursor-pointer ${
                isActive('/home') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('/menu')}
              className={`text-sm font-medium cursor-pointer ${
                isActive('/menu') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => handleNavigation('/order')}
              className={`text-sm font-medium flex items-center cursor-pointer ${
                isActive('/order') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span>Cart</span>
              {order.beers.length > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {order.beers.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className={`h-6 w-6 transition-transform duration-200 ${isMenuOpen ? 'transform rotate-90' : ''}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Mobile menu */}
          <div className={`
            fixed md:hidden top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            pt-20 px-4
          `}>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation('/home')}
                className={`text-sm font-medium cursor-pointer p-2 rounded-md ${
                  isActive('/home') ? 'bg-red-50 text-red-500' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/menu')}
                className={`text-sm font-medium cursor-pointer p-2 rounded-md ${
                  isActive('/menu') ? 'bg-red-50 text-red-500' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => handleNavigation('/order')}
                className={`text-sm font-medium cursor-pointer p-2 rounded-md flex items-center justify-between ${
                  isActive('/order') ? 'bg-red-50 text-red-500' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <span>Cart</span>
                {order.beers.length > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {order.beers.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Overlay */}
          {isMenuOpen && (
            <div 
              className="fixed md:hidden inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 