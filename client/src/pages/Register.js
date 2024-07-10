import React from "react";

const Register = () => {
	const {newUser, setNewUser} = React.useState('');
	const {newPassword, setNewPassword} = React.useState('');
	const {confirmPassword, setConfirmPassword} = React.useState('');


	return (
		<div className="flex justify-center items-center h-screen bg-gray-600">
		<div className='bg-white p-6 rounded-lg shadow-lg'>
			<h1 className="text-2xl font-bold mb-4 text-center"> Register </h1>
			<form className='flex flex-col'>
				<input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} name="username" placeholder='Create Username' className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none'/>
				<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="password" placeholder='Create Password' className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none'/>
				<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="password" placeholder='Confirm Password' className='border-2 border-black rounded mb-2 p-1'/>
				<input type="submit" value="Create Account" className='bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded mb-3 transition duration-300 ease-in-out' />
			</form>
			<p className='text-gray-700 text-sm text-center'>Already have an account? <a href='/' className='text-blue-500 hover:underline'>Login here</a></p>
			</div>
		</div>
	);
};

export default Register;