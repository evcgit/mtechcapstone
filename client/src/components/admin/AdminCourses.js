import React, { useState } from 'react';
import { ReactComponent as UpArrow } from '../../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../../assets/chevron-down-solid.svg';
import { StudentsModal, EditCourseModal } from './AdminModals';

const AdminCourses = ({ isOpen, toggleCard, course, onCourseUpdate }) => {
  const [showStudents, setShowStudents] = useState(false);
  const [showClassEdit, setShowClassEdit] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(course);

  const toggleShowStudents = () => {
    setShowStudents(prevState => !prevState);
  };

  const toggleShowClassEdit = () => {
    setShowClassEdit(prevState => !prevState);
  };

  const handleCourseUpdate = (updatedCourse) => {
    setCurrentCourse(updatedCourse);
    if (onCourseUpdate) {
      onCourseUpdate(updatedCourse);
    }
    setShowClassEdit(false); // Close the modal after saving
  };

  return (
    <div className='bg-slate-100 rounded p-4'>
      <div className='flex justify-between items-center cursor-pointer' onClick={toggleCard}>
        <h2 className='text-xl font-semibold'>
          {currentCourse.title}
          <span className='p-5 text-grey text-sm'>{currentCourse.string_id}</span>
        </h2>
        <span>{isOpen ? <DownArrow className='w-6 h-6' /> : <UpArrow className='w-6 h-6' />}</span>
      </div>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className='mt-2'>
          <p>{currentCourse.description}</p>
        </div>
        <div className='mt-4 flex justify-between items-center p-4 bg-white rounded shadow-md'>
          <div className='text-left space-y-1'>
            <p className='text-lg font-semibold'>{currentCourse.classroom_number}</p>
            <p className='text-md text-gray-700'>{currentCourse.schedule}</p>
            <p className='text-md text-gray-700'>Spots Left: {currentCourse.maximum_capacity}</p>
          </div>
          <div className='text-center space-y-1'>
            <p className='text-lg font-semibold text-gray-800'>${currentCourse.tuition_cost}</p>
            <p className='text-md text-gray-700'>Credits: {currentCourse.credit_hours}</p>
            <button onClick={toggleShowClassEdit} className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white mr-2'>
              Edit Course
            </button>
            <button onClick={toggleShowStudents} className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
              Students
            </button>
          </div>
        </div>
      </div>
      <StudentsModal 
        isOpen={showStudents}
        onClose={toggleShowStudents}
        title={currentCourse.title}
        string_id={currentCourse.string_id}
      />
      <EditCourseModal
        isOpen={showClassEdit}
        onClose={toggleShowClassEdit}
        course={currentCourse}
        onCourseUpdate={handleCourseUpdate}
      />
    </div>
  );
};

export default AdminCourses;
