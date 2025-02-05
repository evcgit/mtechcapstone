import React from 'react';
import { ReactComponent as UpArrow } from '../../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../../assets/chevron-down-solid.svg';

const RegisterCard = ({ isOpen, toggleCard, addToCart, course }) => {
    const isFull = course.maximum_capacity === 0;
    const isLowSpots = course.maximum_capacity > 0 && course.maximum_capacity < 5;

    return (
        <div className='bg-slate-100 rounded p-4 relative'>
            <div className='flex justify-between items-center cursor-pointer' onClick={toggleCard}>
                <h2 className='text-xl font-semibold flex items-center'>
                    {course.title}
                    
                    <span className='p-5 text-grey text-sm'>{course.string_id}</span>
                    {isFull && (
                        <span className='ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                            Spots Unavailable
                        </span>
                    )}
                    {!isFull && isLowSpots && (
                        <span className='ml-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                            Few Spots Left
                        </span>
                    )}
                    {!isFull && !isLowSpots && (
                        <span className='ml-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                            Spots Available
                        </span>
                    )}
                </h2>
                <span>{isOpen ? <DownArrow className='w-6 h-6' /> : <UpArrow className='w-6 h-6' />}</span>
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='mt-2'>
                    <p>{course.description}</p>
                </div>
                <div className='mt-4 flex justify-between items-center p-4 bg-white rounded shadow-md'>
                    <div className='text-left space-y-1'>
                        <p className='text-lg font-semibold'>{course.classroom_number}</p>
                        <p className='text-md text-gray-700'>{course.schedule}</p>
                        <p className='text-md text-gray-700'>
                            {isFull ? 'Unavailable' : `Spots Left: ${course.maximum_capacity}`}
                        </p>
                    </div>
                    <div className='text-center space-y-1'>
                        <p className='text-lg font-semibold text-gray-800'>{course.cost}</p>
                        <p className='text-md text-gray-700'>Credits: {course.credit_hours}</p>
                        <button 
                            onClick={isFull ? null : addToCart} 
                            className={`font-bold py-2 px-4 rounded border-2 ${isFull ? 'bg-gray-300 border-gray-400 text-gray-500' : 'text-slate-500 bg-slate-200 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'}`}
                            disabled={isFull}
                        >
                            {isFull ? 'Class Full' : 'Add Class'}
                        </button>
                    </div>
                </div>
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {course.string_id}
                </div>
            </div>
        </div>
    );
};

export default RegisterCard;
