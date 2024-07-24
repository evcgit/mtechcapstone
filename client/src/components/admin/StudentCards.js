import React, { useState } from 'react';
import { ReactComponent as UpArrow } from '../../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../../assets/chevron-down-solid.svg';
import { ReactComponent as VerticalDots } from '../../assets/vertical-dots.svg';

export const StudentCard = ({ student, toggleCard, isOpen }) => {
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
								<button className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
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

export const CompactStudentCard = ({ student, onRemove }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <div className='bg-slate-100 rounded-lg p-4 w-full max-w-md shadow-lg flex justify-between items-center'>
      <div className='text-left'>
        <h2 className='text-lg font-semibold'>{student.first_name} {student.last_name}</h2>
        <p className='text-xs text-gray-500'>ID: {student.user_id}</p>
      </div>
      <div className='relative'>
        <button onClick={toggleDropdown} className='focus:outline-none'>
          <VerticalDots className='w-6 h-6 text-gray-700' />
        </button>
        {dropdownOpen && (
          <div className='absolute right-0 mt-2 w-30 bg-white border rounded shadow-md'>
            <button
              onClick={onRemove}
              className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200'
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

