import React, { useState } from 'react';
import { ReactComponent as UpArrow } from '../../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../../assets/chevron-down-solid.svg';
import { StudentsModal , EditCourseModal } from './AdminModals';

const AdminCourses = ({ title, isOpen, toggleCard, description, string_id, credits, cost, schedule, classroom_number, spots_left }) => {
	const [showStudents, setShowStudents] = useState(false);
	const [showClassEdit, setShowClassEdit] = useState(false);

	const toggleShowStudents = () => {
		setShowStudents(prevState => !prevState);
	};

	const toggleShowClassEdit = () => {
		setShowClassEdit(prevState => !prevState);
	};

    return (
        <div className='bg-slate-100 rounded p-4'>
            <div className='flex justify-between items-center cursor-pointer' onClick={toggleCard}>
                <h2 className='text-xl font-semibold'>
                    {title}
                    <span className='p-5 text-grey text-sm'>{string_id}</span>
                </h2>
                <span>{isOpen ? <DownArrow className='w-6 h-6' /> : <UpArrow className='w-6 h-6' />}</span>
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='mt-2'>
                    <p>{description}</p>
                </div>
                <div className='mt-4 flex justify-between items-center p-4 bg-white rounded shadow-md'>
                    <div className='text-left space-y-1'>
                        <p className='text-lg font-semibold'>{classroom_number}</p>
                        <p className='text-md text-gray-700'>{schedule}</p>
                        <p className='text-md text-gray-700'>Spots Left: {spots_left}</p>
                    </div>
                    <div className='text-center space-y-1'>
                        <p className='text-lg font-semibold text-gray-800'>{cost}</p>
                        <p className='text-md text-gray-700'>Credits: {credits}</p>
                        <button onClick={toggleShowClassEdit} className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white mr-2'>
                            Edit Course
                        </button>
                        <button onClick={toggleShowStudents} className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
                            Students
                        </button>
                    </div>
                </div>
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {string_id}
                </div>
            </div>
						<StudentsModal 
						isOpen={showStudents}
						onClose={toggleShowStudents}
						title={title}
						string_id={string_id}
						/>

						<EditCourseModal
						isOpen={showClassEdit}
						onClose={toggleShowClassEdit}
						title={title}
						string_id={string_id}
						/>
        </div>
    );
};

export default AdminCourses;
