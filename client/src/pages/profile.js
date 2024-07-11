import React, { useState } from 'react';
import Header from '../components/Header';
import useAuth from '../auth/auth';

const Profile = () => {
    useAuth();

    const [user, setUser] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
        username: 'johndoe',
        password: 'password',
    });
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);

    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState(user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({
            ...updatedUser,
            [name]: value,
        });
    };

    const handleSave = () => {
        setUser(updatedUser);
        setEditMode(false);
    };

    return (
        <div className='bg-gray-900 h-screen w-screen flex flex-col'>
            <Header />
            <div className='flex justify-center items-center mt-10 h-full'>
                <div className='w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Profile</h1>
                    {!editMode ? (
                        <div className='space-y-4'>
                            <div className="flex flex-col w-full">
                                <div className='text-center'>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        name="firstName"
                                        placeholder="First Name"
                                        className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                        disabled='true'
                                    />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        name="lastName"
                                        placeholder="Last Name"
                                        className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                        disabled='true'
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                        placeholder="Email"
                                        className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                        disabled='true'
                                    />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        name="phone"
                                        placeholder="Phone Number"
                                        className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                        disabled='true'
                                    />
                                    <input
                                        type="text"
                                        value={user.username}
                                        name="username"
                                        placeholder="Username"
                                        className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                        disabled='true'
                                    />
                                    <input
                                        type="password"
                                        value={user.password}
                                        name="password"
                                        placeholder="Password"
                                        className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                        disabled='true'
                                    />
                                    <div />
                                    <button
                                        className='mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300'
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="flex flex-wrap">
                            <div className="flex flex-col w-full md:w-1/2 pr-2">
                                <input
                                    type="text"
                                    value={updatedUser.firstName}
                                    onChange={handleChange}
                                    name="firstName"
                                    placeholder="First Name"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                                <input
                                    type="email"
                                    value={updatedUser.email}
                                    onChange={handleChange}
                                    name="email"
                                    placeholder="Email"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={updatedUser.username}
                                    onChange={handleChange}
                                    name="username"
                                    placeholder="Create Username"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                                <input
                                    type="password"
                                    value={updatedUser.confirmPassword}
                                    onChange={handleChange}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-1/2 pl-2">
                                <input
                                    type="text"
                                    value={updatedUser.lastName}
                                    onChange={handleChange}
                                    name="lastName"
                                    placeholder="Last Name"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                                <input
                                    type="tel"
                                    value={updatedUser.phone}
                                    onChange={handleChange}
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                                <input
                                    type="password"
                                    value={updatedUser.password}
                                    onChange={handleChange}
                                    name="password"
                                    placeholder="Create Password"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="m-0.5 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="m-0.5 px-6 py-2 bg-white text-red-500 font-semibold rounded-lg shadow hover:text-white hover:bg-red-500 transition duration-300"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
