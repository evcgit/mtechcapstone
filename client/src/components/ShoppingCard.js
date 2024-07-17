import React, { useState } from 'react';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const addItemToCart = () => {
        const newItem = {
            id: cartItems.length + 1,
            name: `Item ${cartItems.length + 1}`,
            price: Math.floor(Math.random() * 100) + 1 // Random price between 1 and 100
        };
        setCartItems([...cartItems, newItem]);
        setTotalPrice(totalPrice + newItem.price);
    };

    const removeItemFromCart = (itemId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== itemId);
        const itemToRemove = cartItems.find(item => item.id === itemId);
        setCartItems(updatedCartItems);
        setTotalPrice(totalPrice - itemToRemove.price);
    };

    return (
        <div className='bg-slate-100 rounded p-4'>
            <h2 className='text-xl font-semibold'>Shopping Cart</h2>
            <div className='mt-2'>
                <button 
                    onClick={addItemToCart} 
                    className='bg-blue-500 text-white px-4 py-2 rounded'>
                    Add Item
                </button>
                <div className='mt-4'>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.id} className='flex justify-between items-center'>
                                    <span>{item.name} - ${item.price}</span>
                                    <button 
                                        onClick={() => removeItemFromCart(item.id)} 
                                        className='bg-red-500 text-white px-2 py-1  mt-1 rounded'>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>Total Price: ${totalPrice}</h3>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
