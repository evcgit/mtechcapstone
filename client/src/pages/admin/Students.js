import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdminAuth } from '../../auth/auth';
import backgroundImage from '../../assets/registerbg.webp';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../../components/LoadingSpinner';
import StudentCard from '../../components/admin/StudentCard';

const Students = () => {
	useAdminAuth();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [students, setStudents] = useState([]);
	const [openCards, setOpenCards] = useState([]);

	const fetchStudents = async () => {
		try {
			const response = await fetch('/students', {
				headers: {
					'Content-Type': 'application/json',
					'authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			if (response.ok) {
				const data = await response.json();
				setTimeout(() => {
					setStudents(data);
					setLoading(false);
				}, 700);
			} else {
				const errorData = await response.json();
				enqueueSnackbar(errorData.errorMessage, { variant: 'error' });
			}
		} catch (error) {
			console.error('Error fetching students:', error);
			enqueueSnackbar('Error fetching students', { variant: 'error' });
		}
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	const toggleCard = (user_id) => {
		setOpenCards(prevOpenCards => 
			prevOpenCards.includes(user_id) 
				? prevOpenCards.filter(id => id !== user_id) 
				: [...prevOpenCards, user_id]
		);
	};

	return (
		<div className='min-h-screen w-screen flex flex-col bg-cover'
			style={{ backgroundImage: `url(${backgroundImage})` }}>
			<AdminHeader />
			{loading ? (
				<LoadingSpinner />
			) : (
				<div className="flex flex-col items-center justify-center h-screen custom-scrollbar">
					<div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-2xl">
						{students.map(student => (
							<StudentCard
								key={student.user_id}
								student={student}
								toggleCard={() => toggleCard(student.user_id)}
								isOpen={openCards.includes(student.user_id)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default Students;
