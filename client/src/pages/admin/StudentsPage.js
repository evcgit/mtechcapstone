import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdminAuth } from '../../auth/auth';
import backgroundImage from '../../assets/registerbg.webp';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../../components/LoadingSpinner';
import { StudentCard } from '../../components/admin/StudentCards';
import NewStudent from '../../components/admin/NewStudent';
import { EditUser } from '../../components/admin/AdminModals';

const Students = () => {
	useAdminAuth();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [students, setStudents] = useState([]);
	const [openCards, setOpenCards] = useState([]);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);

	useEffect(() => {
		const fetchStudents = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				enqueueSnackbar('No token found. Please log in again.', { variant: 'error' });
				setLoading(false);
				return;
			}

			try {
				const response = await fetch('/students', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});

				const data = await response.json();

				if (response.ok) {
					setStudents(data);
				} else {
					enqueueSnackbar(data.errorMessage || 'Error fetching students', { variant: 'error' });
				}

				setLoading(false);
			} catch (error) {
				console.error('Error fetching students:', error);
				enqueueSnackbar('Error fetching students', { variant: 'error' });
				setLoading(false);
			}
		};

		fetchStudents();
	}, [enqueueSnackbar]);


	return (
		<div style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh'}}>
		<AdminHeader />
	</div>
	)
};

export default Students;