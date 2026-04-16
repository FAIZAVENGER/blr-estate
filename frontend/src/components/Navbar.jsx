import React from 'react';

function Navbar({ isLoggedIn, userName, setCurrentPage, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => setCurrentPage('home')}
      >
        BLR Estate
      </h1>

      <div className="space-x-4">
        {!isLoggedIn ? (
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-white text-blue-600 px-3 py-1 rounded"
          >
            Login
          </button>
        ) : (
          <>
            <span>Hello, {userName}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
