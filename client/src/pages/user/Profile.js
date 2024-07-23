import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import { useAuth } from '../../auth/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import backgroundImage from '../../assets/profilebg.webp';
import { useSnackbar } from 'notistack';
import AdminHeader from '../../components/admin/AdminHeader';

const Profile = () => {
    useAuth();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [updatedFirstName, setUpdatedFirstName] = useState('');
    const [updatedLastName, setUpdatedLastName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPhone, setUpdatedPhone] = useState('');
		const [isAdmin, setIsAdmin] = useState(false);
		const { enqueueSnackbar } = useSnackbar();

    const handleSave = () => {
        const updatedData = {
            firstName: updatedFirstName,
            lastName: updatedLastName,
            email: updatedEmail,
            phone: updatedPhone
        };

        fetch('/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedData),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
							enqueueSnackbar(data.error, { variant: 'error' });
            } else {
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                setPhone(data.phone);
                setEditMode(false);
								enqueueSnackbar('Profile updated successfully', { variant: 'success' });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            enqueueSnackbar('Failed to update profile', { variant: 'error' });
        });
    };

    useEffect(() => {
        const fetchProfileInfo = async () => {
            fetch('/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setEmail(data.user_email);
                    setPhone(data.user_phone);
										setIsAdmin(data.user_admin);
                    setTimeout(() => {
                      setLoading(false); 
                    }, 700); 
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        };
        fetchProfileInfo();
    }, []);

    return (
      <div className='h-screen flex flex-col bg-cover' 
      style={{ backgroundImage: `url(${backgroundImage})` }}>
				{isAdmin ? ( <Header /> ) : ( <AdminHeader /> )}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className='flex justify-center items-center mt-10 h-full'>
                        <div className='w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-8'>
                            <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Profile</h1>
                            {!editMode ? (
                                <div className='space-y-4'>
                                    <div className="flex flex-col w-full">
                                        <div className='text-center'>
                                            <input
                                                type="text"
                                                value={firstName || ''}
                                                name="firstName"
                                                placeholder="First Name"
                                                className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                disabled={true}
                                            />
                                            <input
                                                type="text"
                                                value={lastName || ''}
                                                name="lastName"
                                                placeholder="Last Name"
                                                className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                disabled={true}
                                            />
                                            <input
                                                type="email"
                                                value={email || ''}
                                                name="email"
                                                placeholder="Email"
                                                className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                disabled={true}
                                            />
                                            <input
                                                type="tel"
                                                value={phone || ''}
                                                name="phone"
                                                placeholder="Phone Number"
                                                className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                disabled={true}
                                            />
                                            <div />
                                            <button
                                                className='mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300'
                                                onClick={() => {
                                                    setUpdatedFirstName(firstName);
                                                    setUpdatedLastName(lastName);
                                                    setUpdatedEmail(email);
                                                    setUpdatedPhone(phone);
                                                    setEditMode(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form>
                                    <div className='space-y-4'>
                                        <div className="flex flex-col w-full">
                                            <div className='text-center'>
                                                <input
                                                    type="text"
                                                    value={updatedFirstName}
                                                    onChange={(e) => setUpdatedFirstName(e.target.value)}
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                />
                                                <input
                                                    type="text"
                                                    value={updatedLastName}
                                                    onChange={(e) => setUpdatedLastName(e.target.value)}
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                />
                                                <input
                                                    type="email"
                                                    value={updatedEmail}
                                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                                    name="email"
                                                    placeholder="Email"
                                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                />
                                                <input
                                                    type="tel"
                                                    value={updatedPhone}
                                                    onChange={(e) => setUpdatedPhone(e.target.value)}
                                                    name="phone"
                                                    placeholder="Phone Number"
                                                    className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1"
                                                />
                                            </div>
                                            <div className="flex flex-col w-full pl-2">
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        className="m-0.5 px-6 py-2 bg-white text-red-500 font-semibold rounded-lg shadow hover:text-white hover:bg-red-500 transition duration-300"
                                                        onClick={() => setEditMode(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="m-0.5 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300 mx-5"
                                                        onClick={handleSave}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
