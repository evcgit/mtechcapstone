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
	// useAdminAuth();
	const token = localStorage.getItem('token');
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);
	const [students, setStudents] = useState([]);
	const [openCards, setOpenCards] = useState([]);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);

	useEffect(() => {
		console.log('Token:', token); 
  const fetchStudents = async () => {
    

    if (!token) {
      enqueueSnackbar('No token found. Please log in again.', { variant: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/students', {
        headers: {
          'Content-Type': 'Application/json',
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



	const openEditModal = (student) => {
		setOpenEdit(true);
		setSelectedStudent(student)
	};

	const closeEditModal = () => {
		setOpenEdit(false);
		setSelectedStudent(null);
	};

	const handleStudentUpdate = (updatedStudent) => {
		setStudents(prevStudents => 
			prevStudents.map(student => 
				student.user_id === updatedStudent.user_id ? updatedStudent : student
			)
		);
	};

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
			{loading ? (
				<LoadingSpinner />
			) : (
				<>
					<AdminHeader />
					<div className='flex flex-col lg:flex-row lg:justify-between p-4 lg:p-20'>
						<div className="w-full lg:w-1/3 flex flex-col">
							<div className="relative">
								<div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl shadow-md z-0" style={{ maxHeight: '75vh', overflow: 'hidden' }}></div>
								<div className="relative z-10 custom-scrollbar overflow-y-auto rounded-3xl" style={{ maxHeight: '75vh' }}>
									<div className="flex flex-col space-y-6 p-4 lg:p-6">
										{students.map(student => (
											<StudentCard
												key={student.user_id}
												student={student}
												toggleCard={() => toggleCard(student.user_id)}
												isOpen={openCards.includes(student.user_id)}
												onEdit = {() => openEditModal(student)}
											/>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="w-full lg:w-1/3 lg:mt-0 mt-4 lg:ml-8 flex justify-center lg:justify-end">
							<div className="w-full max-w-md">
								<div className="overflow-y-auto" style={{ maxHeight: '75vh' }}>
									<NewStudent />
								</div>
							</div>
						</div>
					</div>
				</>
			)}

			{selectedStudent && (
				<EditUser 
					isOpen={openEdit}
					onClose={closeEditModal}
					user={selectedStudent}
					onStudentUpdate={handleStudentUpdate}
				/>
			)}
		</div>
	);
}

export default Students;
