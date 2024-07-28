import React, { useState } from 'react';
import { ReactComponent as UpArrow } from '../../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../../assets/chevron-down-solid.svg';
import { ReactComponent as VerticalDots } from '../../assets/vertical-dots.svg';
import { useSnackbar } from 'notistack';

export const StudentCard = ({ student, toggleCard, isOpen, onEdit }) => {
		return (
			<div className='bg-slate-100 rounded-lg p-6 w-full max-w-2xl shadow-lg'>
				<div className='flex justify-between items-center cursor-pointer' onClick={toggleCard}>
					<h2 className='text-xl font-semibold'>
							{student.first_name} {student.last_name}
					</h2>
					<span>{isOpen ? <DownArrow className='w-6 h-6' /> : <UpArrow className='w-6 h-6' />}</span>
				</div>
				<div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
					<div className='mt-4 p-4 bg-white rounded-lg shadow-md'>
						<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
							<div className='text-left space-y-1 mb-4 md:mb-0'>
								<p className='text-lg font-semibold'>{student.user_email}</p>
								<p className='text-lg font-semibold'>{student.user_phone}</p>
							</div>
							<div className='text-center'>
								<button onClick={onEdit} className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
										Edit
								</button>
							</div>
						</div>
						<div className='text-xs text-gray-500'>
								<p>ID: {student.user_id}</p>
						</div>
					</div>
				</div>
			</div>
		);
}

export const RemoveStudentCard = ({ student, string_id }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  

  const onRemove = () => {
    setDropdownOpen(false);
    fetch('/admin/students/courses', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ user_id: student.user_id, string_id: string_id }),
    })
    .then(res => res.json())
    .then((data) => {
      if (data.errorMessage) {
        enqueueSnackbar(data.errorMessage, { variant: 'error' });
      } else {
        enqueueSnackbar(data.message, { variant: 'success' });
        window.location.reload();
      }
    })
    .catch((error) => {
      enqueueSnackbar('An error occurred. Please try again later.', { variant: 'error' });
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  return (
		<div className='bg-slate-100 rounded-lg p-4 w-full max-w-md shadow-lg flex justify-between items-center'>
		  <div className='text-left'>
		    <h2 className='text-lg font-semibold'>{student.first_name} {student.last_name}</h2>
		    <p className='text-xs text-gray-500'>ID: {student.user_id}</p>
		  </div>
		  <div className='relative flex items-center'>
		    <button onClick={toggleDropdown} className='focus:outline-none'>
		      <VerticalDots className='w-6 h-6 text-gray-700' />
		    </button>
		    {dropdownOpen && (
		      <div className='absolute right-3 top-5 w-30 bg-white border rounded shadow-md'>
		        <button
		          onClick={onRemove}
		          className='block w-full text-left rounded px-5 py-2 text-red-500 hover:bg-gray-200'
		        >
		          Remove
		        </button>
		      </div>
		    )}
		  </div>
		</div>
  );
};


export const AddStudentCard = ({ student, string_id, onStudentAdded }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleAddStudent = async () => {
    try {
      const response = await fetch('/admin/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ string_id, user_id: student.user_id })
      });

      if (response.ok) {
        enqueueSnackbar('Student added to the course', { variant: 'success' });
        onStudentAdded(student.user_id); // Call the callback to update the parent component
      } else {
        const data = await response.json();
        enqueueSnackbar(data.errorMessage, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error adding student to the course:', error);
      enqueueSnackbar('Failed to add student', { variant: 'error' });
    }
  };

  return (
    <div className='bg-slate-100 rounded-lg p-4 w-full max-w-md shadow-lg flex justify-between items-center'>
      <div className='text-left'>
        <h2 className='text-lg font-semibold'>{student.first_name} {student.last_name}</h2>
        <p className='text-xs text-gray-500'>ID: {student.user_id}</p>
      </div>
      <div className='relative flex items-center'>
        <div className='w-30 bg-white border rounded shadow-md'>
          <button 
            onClick={handleAddStudent} // Pass the function reference, not the invocation
            className=' w-full text-left rounded px-5 py-2 text-blue-500 hover:bg-gray-200'
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};


