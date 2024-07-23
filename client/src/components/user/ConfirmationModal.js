import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-8 rounded shadow-lg'>
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

export default ConfirmationModal;
