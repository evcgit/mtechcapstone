import React, { useState } from "react";
import Header from '../components/Header';
import useAuth from '../auth/auth';
import RegisterCard from '../components/RegisterCard';
import ShoppingCart from '../components/ShoppingCard';

const Register = () => {
    useAuth();

    // State to track open cards
    const [openCards, setOpenCards] = useState([]);

    // Toggle function to open/close a card
    const toggleCard = (cardId) => {
        if (openCards.includes(cardId)) {
            setOpenCards(openCards.filter(id => id !== cardId));
        } else {
            setOpenCards([...openCards, cardId]);
        }
    };

    return (
        <>
            <div className='bg-gray-900 h-screen w-screen flex flex-col'>
                <Header />
                <div className='flex p-20 h-screen'>
                    <div className="w-2/3 ml-10">
                        <RegisterCard
                            title='Introduction to Computer Science'
                            description='This course will introduce students to the fundamental concepts behind computers and computer programming. Topics covered include basic programming logic, algorithm development, computer architecture, and software engineering.'
                            course_id='CSCI-1001'
                            schedule='MWF 9:00 AM - 10:00 AM'
                            classroom_number='LAB-123'
                            spots_left='4'
                            credits='3'
                            cost='$900.00'
                            isOpen={openCards.includes('CSCI-1001')}
                            toggleCard={() => toggleCard('CSCI-1001')}
                        />
                        <RegisterCard
                            title='Data Structures and Algorithms'
                            description='This course will cover advanced data structures and algorithms used in computer science. Topics covered include linked lists, stacks, queues, trees, graphs, and sorting algorithms.'
                            course_id='CSCI-2001'
                            schedule='MWF 10:00 AM - 11:00 AM'
                            classroom_number='LAB-234'
                            spots_left='2'
                            credits='3'
                            cost='$1200.00'
                            isOpen={openCards.includes('CSCI-2001')}
                            toggleCard={() => toggleCard('CSCI-2001')}
                        />
                    </div>
                    <div className="w-1/3 ml-20">
                        <ShoppingCart />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;
