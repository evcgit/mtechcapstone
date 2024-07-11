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
        <div className='bg-gray-900 h-screen flex flex-col'>
            <Header />
            <div className='flex justify-center items-center mt-10 h-full'>
                <div className='w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Profile</h1>
                    {!editMode ? (
                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='text-gray-700'>
                                    <p className='text-lg font-semibold'><strong>First Name:</strong></p>
                                    <p className='text-md'>{user.firstName}</p>
                                </div>
                                <div className='text-gray-700'>
                                    <p className='text-lg font-semibold'><strong>Last Name:</strong></p>
                                    <p className='text-md'>{user.lastName}</p>
                                </div>
                                <div className='text-gray-700'>
                                    <p className='text-lg font-semibold'><strong>Email:</strong></p>
                                    <p className='text-md'>{user.email}</p>
                                </div>
                                <div className='text-gray-700'>
                                    <p className='text-lg font-semibold'><strong>Phone:</strong></p>
                                    <p className='text-md'>{user.phone}</p>
                                </div>
                                <div className='text-gray-700'>
                                    <p className='text-lg font-semibold'><strong>Username:</strong></p>
                                    <p className='text-md'>{user.username}</p>
                                </div>
                            </div>
                            <div className='text-center'>
                                <button 
                                    className='mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300'
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="flex flex-wrap space-y-4">
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
                                    type="text"
                                    value={updatedUser.lastName}
                                    onChange={handleChange}
                                    name="lastName"
                                    placeholder="Last Name"
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
                                    type="tel"
                                    value={updatedUser.phone}
                                    onChange={handleChange}
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-1/2 pl-2">
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
                                    value={updatedUser.password}
                                    onChange={handleChange}
                                    name="password"
                                    placeholder="Create Password"
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
                                <div className="flex justify-between">
                                    <button 
                                        type="button"
                                        className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button 
                                        type="button"
                                        className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-300"
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
