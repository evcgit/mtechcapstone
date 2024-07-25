import React, { useState, useEffect }from "react";
import { CompactStudentCard } from "./StudentCards";
import { useSnackbar } from 'notistack';

export const StudentsModal = ({ isOpen, onClose, string_id, title }) => {
	const [students, setStudents] = useState([]);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await fetch('/registered/students', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}, 
					body: JSON.stringify({ string_id })
				});
				if (response.ok) {
					const data = await response.json();
					setStudents(data);
				} else {
					console.error('Failed to fetch students');
				}
			} catch (error) {
				console.error('Error fetching students:', error);
			}
		};

		if (isOpen) {
			fetchStudents();
		}
	}, [isOpen, string_id]);
	
	
	if (!isOpen) {
		return null;
	}
	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-8 rounded shadow-lg max-w-lg max-h-[80vh] overflow-hidden'>
				<h2 className='text-lg font-semibold mb-4'>{title} Students</h2>
				<div className='max-h-[60vh] overflow-y-auto'>
					{students.map(student => (
						<div className='mb-4'>
							<CompactStudentCard key={student.user_id} student={student} />
						</div>
					))}
				</div>
				<div className='flex justify-end mt-4'>
					<button onClick={onClose} className='bg-gray-300 text-gray-800 px-4 py-2 mr-2 rounded'>
						Close
					</button>
					<button className='text-slate-500 bg-slate-200 font-bold px-4 py-2 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
						Add
					</button>
				</div>
			</div>
		</div>
	);
}

export const EditCourseModal = ({ isOpen, onClose, title, string_id }) => {	
	if (!isOpen) {
		return null;
	}
	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-8 rounded shadow-lg'>
				<h2 className='text-lg font-semibold mb-4'>{title}</h2>
				<span>{string_id}</span>
				<div className='flex justify-end'>
					<button onClick={onClose} className='bg-gray-300 text-gray-800 px-4 py-2 mr-2 rounded'>
						Cancel
					</button>
					<button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
						Edit
					</button>
				</div>
			</div>
		</div>
	);
}


export const EditUser = ({ isOpen, onClose, user, onStudentUpdate }) => {	
	const [updatedFirstName, setUpdatedFirstName] = useState(user.first_name);
	const [updatedLastName, setUpdatedLastName] = useState(user.last_name);
	const [updatedEmail, setUpdatedEmail] = useState(user.user_email);
	const [updatedPhone, setUpdatedPhone] = useState(user.user_phone);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (user) {
				setUpdatedFirstName(user.first_name || '');
				setUpdatedLastName(user.last_name || '');
				setUpdatedEmail(user.user_email || '');
				setUpdatedPhone(user.user_phone || '');
		}
	}, [user]);

	const handleSave =  () => {
		fetch('/admin/edit/user', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}, 
			body: JSON.stringify({
				user_id: user.user_id,
				first_name: updatedFirstName,
				last_name: updatedLastName,
				email: updatedEmail,
				phone: updatedPhone
			}),
		})
		.then(response => response.json())
		.then((data) => {
			if (data.errorMessage) {
				enqueueSnackbar(data.errorMessage, { variant: 'error' });
			} else {
				enqueueSnackbar(data.message, { variant: 'success' });
				onStudentUpdate({
					...user,
					first_name: updatedFirstName,
					last_name: updatedLastName,
					user_email: updatedEmail,
					user_phone: updatedPhone
				});
				onClose();
			}
		})
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-8 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3'>
				<h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Edit Student</h2>
				<form>
					<div className='space-y-4'>
						<div className='flex flex-col w-full text-center'>
							<input
								type='text'
								value={updatedFirstName}
								onChange={(e) => setUpdatedFirstName(e.target.value)}
								name='firstName'
								placeholder='First Name'
								className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
							/>
							<input
								type='text'
								value={updatedLastName}
								onChange={(e) => setUpdatedLastName(e.target.value)}
								name='lastName'
								placeholder='Last Name'
								className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
							/>
							<input
								type='email'
								value={updatedEmail}
								onChange={(e) => setUpdatedEmail(e.target.value)}
								name='email'
								placeholder='Email'
								className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
							/>
							<input
								type='tel'
								value={updatedPhone}
								onChange={(e) => setUpdatedPhone(e.target.value)}
								name='phone'
								placeholder='Phone Number'
								className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
							/>
						</div>
						<div className='flex justify-center space-x-3'>
							<button
								type='button'
								className='px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400 transition duration-300'
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								type='button'
								className='px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300'
								onClick={handleSave}
							>
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

