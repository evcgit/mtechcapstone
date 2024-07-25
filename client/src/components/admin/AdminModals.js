import React, { useState, useEffect }from "react";
import { CompactStudentCard } from "./StudentCards";
import { useSnackbar } from 'notistack';
import ConfirmationModal from "../user/ConfirmationModal";

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

	const handleBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
				onClose();
		}
	};
	
	
	if (!isOpen) {
		return null;
	}
	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'
		onClick={handleBackgroundClick}>
			<div className='bg-white p-8 rounded shadow-lg min-w-[40vh] max-h-[80vh] min-h-[30vh] overflow-hidden'>
				<h2 className='text-lg font-semibold mb-4'>{title} Students</h2>
				<div className='max-h-[50vh] min-h-[30vh] overflow-y-auto custom-scrollbar'>
					{students.map(student => (
						<div className='mb-4'>
							<CompactStudentCard key={student.user_id} student={student} string_id = {string_id} />
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


export const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdate }) => {
  const [updatedTitle, setUpdatedTitle] = useState(course.title);
  const [updatedSchedule, setUpdatedSchedule] = useState(course.schedule);
  const [updatedClassroomNumber, setUpdatedClassroomNumber] = useState(course.classroom_number);
  const [updatedMaximumCapacity, setUpdatedMaximumCapacity] = useState(course.maximum_capacity);
  const [updatedCost, setUpdatedCost] = useState(course.tuition_cost);
  const [updatedCreditHours, setUpdatedCreditHours] = useState(course.credit_hours);
  const [updatedDescription, setUpdatedDescription] = useState(course.description);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (course) {
      setUpdatedTitle(course.title);
      setUpdatedSchedule(course.schedule);
      setUpdatedClassroomNumber(course.classroom_number);
      setUpdatedMaximumCapacity(course.maximum_capacity);
      setUpdatedCost(course.tuition_cost);
      setUpdatedCreditHours(course.credit_hours);
      setUpdatedDescription(course.description);
    }
  }, [course]);

  const toggleConfirmation = () => {
    setShowConfirmation(prevState => !prevState);
  };

  const handleSave = () => {
    fetch('/admin/edit/course', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        string_id: course.string_id,
        title: updatedTitle,
        schedule: updatedSchedule,
        classroom_number: updatedClassroomNumber,
        maximum_capacity: updatedMaximumCapacity,
        cost: updatedCost,
        credit_hours: updatedCreditHours,
        description: updatedDescription,
      }),
    })
    .then(response => response.json())
    .then((data) => {
      if (data.errorMessage) {
        enqueueSnackbar(data.errorMessage, { variant: 'error' });
      } else {
        onClose();
        enqueueSnackbar(data.message, { variant: 'success' });
        onCourseUpdate({
          ...course,
          title: updatedTitle,
          schedule: updatedSchedule,
          classroom_number: updatedClassroomNumber,
          maximum_capacity: updatedMaximumCapacity,
          cost: updatedCost,
          credit_hours: updatedCreditHours,
          description: updatedDescription,
        });
      }
    })
    .catch((error) => {
      console.error('Error updating course:', error);
      enqueueSnackbar('Error updating course', { variant: 'error' });
    });
  };

  const handleDeleteCourse = () => {
    fetch('/admin/delete/course', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ string_id: course.string_id }),
    })
    .then(response => response.json())
    .then((data) => {
      if (data.errorMessage) {
        enqueueSnackbar(data.errorMessage, { variant: 'error' });
      } else {
        onClose();
        enqueueSnackbar(data.message, { variant: 'success' });
        window.location.reload();
      }
    })
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50' 
      onClick={handleBackgroundClick}
    >
      <div className='bg-white p-8 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 relative'>
        <button 
          onClick={onClose} 
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Edit Course</h2>
        <form>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label className='text-left text-gray-700 ml-2'>Title</label>
              <input
                type='text'
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                name='title'
                placeholder='Course Title'
                className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-left text-gray-700 ml-2'>Schedule</label>
              <input
                type='text'
                value={updatedSchedule}
                onChange={(e) => setUpdatedSchedule(e.target.value)}
                name='schedule'
                placeholder='Schedule'
                className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-left text-gray-700 ml-2'>Classroom Number</label>
              <input
                type='text'
                value={updatedClassroomNumber}
                onChange={(e) => setUpdatedClassroomNumber(e.target.value)}
                name='classroom_number'
                placeholder='Classroom Number'
                className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-left text-gray-700 ml-2'>Spots Left</label>
              <input
                type='text'
                value={updatedMaximumCapacity}
                onChange={(e) => setUpdatedMaximumCapacity(e.target.value)}
                name='maximum_capacity'
                placeholder='Spots Left'
                className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-left text-gray-700 ml-2'>Cost</label>
              <input
                type='text'
                value={updatedCost}
                onChange={(e) => setUpdatedCost(e.target.value)}
                name='cost'
                placeholder='Cost'
                className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-left text-gray-700 ml-2'>Credit Hours</label>
              <input
                type='text'
                value={updatedCreditHours}
                onChange={(e) => setUpdatedCreditHours(e.target.value)}
                name='credit_hours'
                placeholder='Credit Hours'
                className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none mx-1'
              />
            </div>
          </div>
          <div className='flex flex-col mt-4'>
            <label className='text-left text-gray-700 ml-2'>Description</label>
            <textarea
              type='text'
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              name='description'
              placeholder='Description'
              className='border-2 border-gray-300 rounded mb-3 p-2 min-h-[20vh] max-h-[30vh] focus:border-blue-500 focus:outline-none mx-1'
            />
          </div>
          <div className='flex justify-center space-x-3'>
            <button
              type='button'
              className='px-6 py-2 bg-white text-red-500 border-2 border-red-500 font-semibold rounded-lg shadow hover:bg-red-600 hover:text-white transition duration-300'
              onClick={toggleConfirmation}
            >
              Delete
            </button>
            <button
              type='button'
              className='px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300'
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <ConfirmationModal 
        isOpen={showConfirmation}
        title='Remove Course'
        message={`Are you sure you want to delete course ${course.title}?`}
        onConfirm={() => {handleDeleteCourse(); toggleConfirmation();}}
        onCancel={() => {toggleConfirmation();}}
      />
    </div>
  );
};




export const EditUser = ({ isOpen, onClose, user, onStudentUpdate }) => {	
	const [updatedFirstName, setUpdatedFirstName] = useState(user.first_name);
	const [updatedLastName, setUpdatedLastName] = useState(user.last_name);
	const [updatedEmail, setUpdatedEmail] = useState(user.user_email);
	const [updatedPhone, setUpdatedPhone] = useState(user.user_phone);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (user) {
				setUpdatedFirstName(user.first_name);
				setUpdatedLastName(user.last_name);
				setUpdatedEmail(user.user_email);
				setUpdatedPhone(user.user_phone);
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

	const handleBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
				onClose();
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div 
		className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50' 
		onClick={handleBackgroundClick}
>
		<div className='bg-white p-8 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 relative'>
				<button 
						onClick={onClose} 
						className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
				>
						<svg 
								xmlns="http://www.w3.org/2000/svg" 
								className="h-6 w-6" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke="currentColor"
						>
								<path 
										strokeLinecap="round" 
										strokeLinejoin="round" 
										strokeWidth={2} 
										d="M6 18L18 6M6 6l12 12" 
								/>
						</svg>
				</button>
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
												className='px-6 py-2 bg-white text-red-500 border-2 border-red-500 font-semibold rounded-lg shadow hover:bg-red-600 hover:text-white transition duration-300'
												onClick={onClose}
										>
												Delete
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

