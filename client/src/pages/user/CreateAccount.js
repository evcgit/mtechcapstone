import React, { useState } from "react";
import backgroundImage from "../../assets/registeruni.jpg";
import { useSnackbar } from 'notistack';

const formatName = (name) => {
	if (!name) return '';
	const trimmedName = name.trim();
	if (trimmedName.length === 0) return '';
	const firstLetter = trimmedName.charAt(0).toUpperCase();
	const lastLetter = trimmedName.charAt(trimmedName.length - 1).toLowerCase();
	const middle = trimmedName.slice(1, -1).toLowerCase();
	return `${firstLetter}${middle}${lastLetter}`;
};

const CreateAccount = () => {
  const [newUser, setNewUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
		const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
		e.preventDefault();

		const userData = {
			username: newUser.toLowerCase(),
			password: newPassword,
   confirmPassword: confirmPassword,
   email: email,
   firstName: formatName(firstName),
   lastName: formatName(lastName),
   userAdmin: false,
   phone: phone
		};

		fetch('/auth/createAccount', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.errorMessage) {
					enqueueSnackbar(data.errorMessage, { variant: 'error' });
				}
				else {
          setNewUser('');
          setNewPassword('');
          setConfirmPassword('');
          setEmail('');
          setFirstName('');
          setLastName('');
          setPhone('');
					enqueueSnackbar('Account created', { variant: 'success' });
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				enqueueSnackbar('Internal server error', { variant: 'error' });
			});
	};

  return (
    <div className="flex items-center justify-center h-screen bg-cover"
		style={{
			backgroundImage: `url(${backgroundImage})`,
		}}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center"> Create Account </h1>
        <form className="flex flex-wrap" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full md:w-1/2 pr-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.trim())}
              name="firstName"
              placeholder="First Name"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value.trim())}
              name="lastName"
              placeholder="Last Name"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              name="email"
              placeholder="Email"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
              name="phone"
              placeholder="Phone Number"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 pl-2">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value.trim())}
              name="username"
              placeholder="Create Username"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value.trim())}	
              name="password"
              placeholder="Create Password"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
							required
            />
            <input
              type="submit"
              value="Submit"
              className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded mb-3 transition duration-300 ease-in-out w-full"
              style={{ alignSelf: 'flex-end' }}
            />
          </div>
        </form>
        <p className="text-gray-700 text-sm text-center">
          Already have an account? 
          <a href="/" className="text-blue-500 hover:underline"> Login here </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
