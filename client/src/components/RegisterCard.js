import React from 'react';
import { ReactComponent as UpArrow } from '../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../assets/chevron-down-solid.svg';

const RegisterCard = ({ title, isOpen, toggleCard, description, course_id, credits, cost, schedule, classroom_number, spots_left, addToCart }) => {
    return (
        <div className='bg-slate-100 rounded p-4 mb-4'>
            <div className='flex justify-between items-center cursor-pointer' onClick={toggleCard}>
                <h2 className='text-xl font-semibold'>{title}<span className='p-5 text-grey text-sm'>{course_id}</span></h2>
                <span>{isOpen ? <DownArrow className='w-6 h-6' /> : <UpArrow className='w-6 h-6' />}</span>
            </div>
            <div className={`transition-all duration-15000 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
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
                        <button onClick={addToCart} className='text-slate-500 bg-slate-200 font-bold py-2 px-4 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
                            Add Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCard;
