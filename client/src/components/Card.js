import React from 'react';
import { ReactComponent as UpArrow } from '../assets/angle-up-solid.svg';
import { ReactComponent as DownArrow } from '../assets/chevron-down-solid.svg';

const Card = ({ title, isOpen, toggleCard }) => {
  return (
    <div className='bg-slate-100 rounded p-4'>
      <div className='flex justify-between items-center cursor-pointer' onClick={toggleCard}>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <span>{isOpen ? <DownArrow className='w-6 h-6' /> : <UpArrow className='w-6 h-6' />}</span>
      </div>
      <div
        className={`transition-all duration-15000 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className='mt-2'>
          <p>Content specific to {title}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
