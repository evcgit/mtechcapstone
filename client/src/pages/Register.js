import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import RegisterCard from '../components/RegisterCard';
import ShoppingCart from '../components/ShoppingCart';

const Register = () => {
    const [openCards, setOpenCards] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/courses');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const toggleCard = (stringId) => {
        if (openCards.includes(stringId)) {
            setOpenCards(openCards.filter(id => id !== stringId));
        } else {
            setOpenCards([...openCards, stringId]);
        }
    };

    const addToCart = (course) => {
        if (!cartItems.some(item => item.string_id === course.string_id)) {
            setCartItems([...cartItems, course]);
            alert('Course added to cart');
        } else {
            alert('Course is already in the cart');
        }
    };

    return (
        <div className='bg-gray-900 min-h-screen w-screen flex flex-col'>
            <Header />
            <div className='flex flex-grow p-20'>
                <div className="w-2/3 ml-10 overflow-y-auto" style={{ maxHeight: '75vh', minHeight: '75vh' }}>
                    <div className="flex flex-col space-y-8 p-1">
                        {courses.map(course => (
                            <RegisterCard
                                key={course.string_id} 
                                title={course.title}
                                description={course.description}
                                string_id={course.string_id}
                                schedule={course.schedule}
                                classroom_number={course.classroom_number}
                                spots_left={course.maximum_capacity}
                                credits={course.credit_hours}
                                cost={`$${course.tuition_cost}`}
                                isOpen={openCards.includes(course.string_id)}
                                toggleCard={() => toggleCard(course.string_id)}
                                addToCart={() => addToCart({
                                    title: course.title,
                                    string_id: course.string_id,
                                    cost: `$${course.tuition_cost}`
                                })}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-2/4 ml-20 flex justify-end">
                    <div className="w-2/3">
                        <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
