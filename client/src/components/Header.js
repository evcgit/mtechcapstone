import React from "react";

const Header = () => {
	return (
		<div className="flex items-center justify-between px-6 bg-gray-600 border-b-2 h-16">
		 
			<nav className="flex-1 flex justify-center space-x-12">
				<a href="#" className="text-lg hover:text-white">Home</a>
				<a href="#" className="text-lg hover:text-white">About</a>
				<a href="#" className="text-lg hover:text-white">Contact</a>
			</nav>

		</div>
	)
}

export default Header;