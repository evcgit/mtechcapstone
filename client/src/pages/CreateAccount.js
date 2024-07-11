import React from "react";
import backgroundImage from "../assets/registeruni.jpg";

const CreateAccount = () => {
  const [newUser, setNewUser] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  return (
    <div className="flex items-center justify-center h-screen bg-cover"
		style={{
			backgroundImage: `url(${backgroundImage})`,
		}}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center"> Create Account </h1>
        <form className="flex flex-wrap">
          <div className="flex flex-col w-full md:w-1/2 pr-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              name="firstName"
              placeholder="First Name"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
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
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              name="password"
              placeholder="Create Password"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
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
