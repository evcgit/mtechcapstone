import React from "react";

const Register = () => {
	const {newUser, setNewUser} = React.useState('');
	const {newPassword, setNewPassword} = React.useState('');
	const {confirmPassword, setConfirmPassword} = React.useState('');


	return (
		<div className='flex justify-center flex-col content-center items-center h-screen bg-gray-600'>
			<h1> Register </h1>
			<form className='flex flex-col'>
				<input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} name="username" placeholder='Create Username' className='border-2 border-black rounded mb-2 p-1'/>
				<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="password" placeholder='Create Password' className='border-2 border-black rounded mb-2 p-1'/>
				<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="password" placeholder='Confirm Password' className='border-2 border-black rounded mb-2 p-1'/>
				<input type="submit" value="Create Account" className='bg-slate-500 hover:bg-slate-700 cursor-pointer text-white py-2 px-4 rounded mb-2'/>
			</form>
			<p className='text-white text-xs'>Already have an account? <a href='/' className='text-blue-400'>Login here</a></p>
		</div>
	);
};

export default Register;