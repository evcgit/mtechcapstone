import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

const NewStudent = () => {
  const [newUser, setNewUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username: newUser,
      password: newPassword,
      confirmPassword: confirmPassword,
      email: email,
      firstName: firstName,
      lastName: lastName,
      userAdmin: isAdmin,
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
        } else {
          setNewUser('');
          setNewPassword('');
          setConfirmPassword('');
          setEmail('');
          setFirstName('');
          setLastName('');
          setPhone('');
          setIsAdmin(false);
					window.location.reload();
          enqueueSnackbar('Account created', { variant: 'success' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        enqueueSnackbar('Internal server error', { variant: 'error' });
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
      <form className="flex flex-wrap" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full md:w-1/2 pr-2">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            name="firstName"
            placeholder="First Name"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            name="lastName"
            placeholder="Last Name"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            name="phone"
            placeholder="Phone Number"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 pl-2">
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            name="username"
            placeholder="Create Username"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            name="password"
            placeholder="Create Password"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
            required
          />
          <div className="flex items-center mb-3">
            <input
              type="radio"
              id="student"
              name="role"
              value="student"
              checked={!isAdmin}
              onChange={() => setIsAdmin(false)}
              className="mr-2"
            />
            <label htmlFor="student" className="mr-4">Student</label>
            <input
              type="radio"
              id="admin"
              name="role"
              value="admin"
              checked={isAdmin}
              onChange={() => setIsAdmin(true)}
              className="mr-2"
            />
            <label htmlFor="admin">Admin</label>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4">
          <input
            type="submit"
            value="Submit"
            className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded transition duration-300 ease-in-out"
          />
        </div>
      </form>
    </div>
  );
};

export default NewStudent;
