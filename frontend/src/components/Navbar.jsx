import React from 'react';
import { Building2, User, LogOut, Home, Info, PlusCircle, Briefcase } from 'lucide-react';

function Navbar({ isLoggedIn, userName, userRole, setCurrentPage, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setCurrentPage('home')}
      >
        <div className="bg-amber-500 p-2 rounded-lg transform group-hover:scale-105 transition-transform duration-300">
          <Building2 className="text-gray-900 w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">BLR Estate</h1>
          <p className="text-xs text-gray-300">by A1 Builders</p>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <button 
          onClick={() => setCurrentPage('home')}
          className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <button 
          onClick={() => setCurrentPage('portfolio')}
          className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium"
        >
          <Briefcase className="w-4 h-4" />
          Portfolio
        </button>
        <button 
          onClick={() => setCurrentPage('about')}
          className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium"
        >
          <Info className="w-4 h-4" />
          About
        </button>
        {userRole === 'owner' && (
          <button 
            onClick={() => setCurrentPage('sell')}
            className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1 text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            Sell Property
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-amber-500 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-all duration-300 transform hover:scale-105"
          >
            Login / Sign Up
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-900" />
              </div>
              <span className="text-sm font-medium">Hello, {userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-all duration-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
