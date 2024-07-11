import React from "react";
import { ReactComponent as LogoutIcon } from "../assets/logout.svg";
import { useNavigate } from "react-router-dom";
 

const Header = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	}

	return (
    <div className="flex items-center justify-between px-6 bg-gray-800 border-b-2 border-gray-700 h-16">
      <div className="text-white text-2xl font-bold">
        BBU
      </div>
      <nav className="flex-1 flex justify-center space-x-12">
        <a href="#" className="relative text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out group">
          Register
          <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
        </a>
        <a href="#" className="relative text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out group">
          Home
          <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
        </a>
        <a href="#" className="relative text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out group">
          Profile
          <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
        </a>
      </nav>
      <div onClick={handleLogout} className="cursor-pointer">
        <LogoutIcon className="w-6 h-6 text-gray-300 hover:text-white transition duration-300 ease-in-out"/>
      </div>
    </div>
  );
};

export default Header;
