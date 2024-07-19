import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal'; // Adjust the path based on your file structure

const ShoppingCart = ({ cartItems, setCartItems }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.cost.replace('$', '')), 0);

    const handleRemoveItem = (string_id, title) => {
        setItemToRemove({ string_id, title }); 
        setShowConfirmation(true); 
    };

    
    const confirmRemoveItem = () => {
        if (!itemToRemove) {
            setShowConfirmation(false);
            return;
        }
        const updatedCartItems = cartItems.filter(item => item.string_id !== itemToRemove.string_id);
        setCartItems(updatedCartItems); 
        setShowConfirmation(false);
        setItemToRemove(null);
    };

    const cancelRemoveItem = () => {
        setShowConfirmation(false); 
        setItemToRemove(null); 
    };

    return (
        <div className='bg-slate-100 rounded p-4 flex flex-col p-10'>
            <h2 className='text-xl font-semibold'>Selected Classes</h2>
            <div className='flex-grow mt-2 overflow-y-auto max-h-full' style={
                {
                    minHeight: '60vh',
                    maxHeight: '60vh'
                }
            }>
                <div className='mt-4'>
                    {cartItems.length === 0 ? (
                        <p className='text-2xl'>No Classes Selected</p>
                    ) : (
                            <ul className="min-h-screen overflow-y-auto" style={
                                {
                                    minHeight: '60vh'
                                }
                        }>
                            {cartItems.map(item => (
                                <li key={item.string_id} className='flex justify-between items-center mb-2'>
                                    <div className='relative group'>
                                        <span className='cursor-pointer'>{item.title} - {item.cost}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.string_id, item.title)}
                                        className='bg-transparent border-2 rounded px-2 border-red-400 text-red-600 hover:bg-red-400 hover:text-white transition duration-300'>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className='mt-4 flex justify-between items-center'>
                <div>
                    <h3 className='text-lg font-semibold'>Total Price: ${totalPrice.toFixed(2)}</h3>
                    <h2 className='text-md text-gray-700'>Total Classes: {cartItems.length}</h2>
                </div>
                <button className='bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 transition duration-300'>
                    Register
                </button>
            </div>

            <ConfirmationModal
                isOpen={showConfirmation}
                title={`Remove ${itemToRemove?.title}`}
                message={itemToRemove ? `Are you sure you want to remove ${itemToRemove.title} (${itemToRemove.string_id}) from the cart?` : ''}
                onConfirm={confirmRemoveItem}
                onCancel={cancelRemoveItem}
            />
        </div>
    );
};

export default ShoppingCart;
