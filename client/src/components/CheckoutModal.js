import React, { useState } from 'react';
import Modal from 'react-modal';

const CheckoutModal = ({ isOpen, onRequestClose, cartItems, totalPrice }) => {
    const [isPaymentView, setIsPaymentView] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(totalPrice);
    const [showCourses, setShowCourses] = useState(false);

    const handleProceedToPayment = () => {
        setIsPaymentView(true);
    };

    const handleGoBack = () => {
        setIsPaymentView(false);
    };

    const handleApplyDiscount = () => {
        if (discountCode === 'chrisislame') {
            setDiscountApplied(true);
            setDiscountedPrice(0); // Apply discount to set price to 0
        } else {
            alert('Invalid discount code');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Checkout Modal"
            className="fixed inset-0 flex items-center justify-center p-4"
            overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 sm:mx-8 lg:mx-12">
                {isPaymentView ? (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1" htmlFor="cardNumber">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter your card number"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1" htmlFor="expiryDate">Expiry Date</label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1" htmlFor="cvv">CVV</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter CVV"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1" htmlFor="discountCode">Discount Code</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="discountCode"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Enter discount code"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyDiscount}
                                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg transition hover:bg-green-600"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {discountApplied && <p className="mt-2 text-green-600">Discount code applied! Total is now $0.00</p>}
                            </div>

                            <div className="mb-6">
                                <button
                                    onClick={() => setShowCourses(!showCourses)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg w-full text-left flex justify-between items-center transition duration-300 hover:bg-gray-300"
                                >
                                    {showCourses ? 'Hide Courses' : 'Show Courses'}
                                    <svg className={`w-5 h-5 transform transition-transform ${showCourses ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showCourses && (
                                    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                                        <ul className="divide-y divide-gray-200">
                                            {cartItems.map(item => (
                                                <li key={item.string_id} className="px-4 py-3 flex justify-between items-center">
                                                    <span className="text-gray-800">{item.title}</span>
                                                    <span className="text-gray-600">{item.cost}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-medium">Total Amount Due:</span>
                                <span className="text-lg font-medium">
                                    ${discountApplied ? discountedPrice.toFixed(2) : totalPrice.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={handleGoBack}
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg transition hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg transition hover:bg-blue-600"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Checkout</h2>
                        <div>
                            <h3 className="text-xl font-medium mb-3 text-gray-700">Review Your Order</h3>
                            <ul className="mb-4">
                                {cartItems.map(item => (
                                    <li key={item.string_id} className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-800">{item.title}</span>
                                        <span className="text-gray-600">{item.cost}</span>
                                    </li>
                                ))}
                            </ul>
                            <h3 className="text-lg font-medium mb-4 text-gray-700">Total Price: ${discountApplied ? discountedPrice.toFixed(2) : totalPrice.toFixed(2)}</h3>
                            
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={onRequestClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg transition hover:bg-gray-600"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleProceedToPayment}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg transition hover:bg-blue-600"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CheckoutModal;
