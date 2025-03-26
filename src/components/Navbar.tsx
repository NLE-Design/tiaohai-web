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
            跳海
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              首页
            </Link>
            <Link
              to="/menu"
              className={`text-sm font-medium ${
                isActive('/menu') ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              酒单
            </Link>
            <Link
              to="/chat"
              className={`text-sm font-medium ${
                isActive('/chat') ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              AI推荐
            </Link>
            <Link
              to="/community"
              className={`text-sm font-medium ${
                isActive('/community') ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              社区
            </Link>
          </div>

          <div className="flex items-center">
            <Link to="/profile" className="text-gray-700 hover:text-gray-900">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>我的</span>
              </div>
            </Link>
          </div>

          {/* 移动端菜单按钮 */}
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