import React, { useState } from 'react';

export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  
	const handleBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
				onCancel();
		}
	};
	
	if (!isOpen) {
    return null;
  }
  return (
      <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'
			onClick={handleBackgroundClick}>
          <div className='bg-white p-8 rounded shadow-lg '>
              <h2 className='text-lg font-semibold mb-4'>{title}</h2>
              <p className='mb-4'>{message}</p>
              <div className='flex justify-end'>
                  <button onClick={onCancel} className='bg-gray-300 text-gray-800 px-4 py-2 mr-2 rounded'>
                      Cancel
                  </button>
                  <button onClick={onConfirm} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                      Confirm
                  </button>
              </div>
          </div>
      </div>
  );
};


export const PasswordPrompt = ({ isOpen, onSubmit, onCancel }) => {
  const [password, setPassword] = useState('');

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50' onClick={handleBackgroundClick}>
      <div className='bg-white p-8 rounded shadow-lg flex items-center flex-col'>
        <h2 className='text-lg font-semibold mb-4'>Enter Password</h2>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='border-2 border-gray-300 rounded mb-4 p-2 focus:border-blue-500 focus:outline-none w-full'
        />
        <div className='flex justify-end'>
          <button onClick={onCancel} className='bg-gray-300 text-gray-800 px-4 py-2 mr-2 rounded'>
            Cancel
          </button>
          <button onClick={handleSubmit} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};


