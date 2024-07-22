import React, { useState } from "react";
import { ReactComponent as LogoutIcon } from "../../assets/logout.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-6 py-2 bg-white/20 backdrop-blur-md h-16 rounded shadow-md mx-4 mt-4">
        <div className="text-white text-2xl font-bold">
          BBU
        </div>
        <div className="hidden md:flex flex-1 justify-center space-x-12">
          <a href="/register" className="relative text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out group">
            Register
            <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
          </a>
          <a href="/home" className="relative text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out group">
            Home
            <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
          </a>
          <a href="/profile" className="relative text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out group">
            Profile
            <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
          </a>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <MenuIcon className="w-6 h-6 text-gray-300 hover:text-white transition duration-300 ease-in-out" />
          </button>
        </div>
        <div onClick={handleLogout} className="hidden md:block cursor-pointer">
          <LogoutIcon className="w-6 h-6 text-gray-300 hover:text-white transition duration-300 ease-in-out" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white/20 backdrop-blur-md rounded shadow-md p-4 flex flex-col items-start z-50">
					<a href="/home" className="relative w-full text-left py-2 text-lg">
            Home
          </a>
          <a href="/register" className="relative w-full text-left py-2 text-lg">
            Register
          </a>
          <a href="/profile" className="relative w-full text-left py-2 text-lg">
            Profile
          </a>
          <div onClick={handleLogout} className="relative w-full text-left py-2 text-lg">
            <div className="flex items-center">
              <LogoutIcon className="w-6 h-6 mr-2 hover:text-white transition duration-300 ease-in-out" />
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
