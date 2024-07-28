import React, { useState, useEffect } from "react";
import Header from '../../components/user/Header';
import RegisterCard from '../../components/user/RegisterCard';
import ShoppingCart from '../../components/user/ShoppingCard';
import backgroundImage from '../../assets/registerbg.webp';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const parseSchedule = (schedule) => {
    return schedule.split(',').map(slot => {
        const [days, time] = slot.trim().split(' ');
        return { days, time };
    });
};

const hasScheduleConflict = (newCourseSchedule, cartItems, registeredCourses) => {
    const newCourseTimes = parseSchedule(newCourseSchedule);

    const allConflictingCourses = [...cartItems, ...registeredCourses];

    for (const item of allConflictingCourses) {
        const itemTimes = parseSchedule(item.schedule);
        for (const newTime of newCourseTimes) {
            for (const itemTime of itemTimes) {
                if (newTime.days === itemTime.days && newTime.time === itemTime.time) {
                    return true;
                }
            }
        }
    }
    return false;
};

const Register = () => {
    const [openCards, setOpenCards] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const fetchCourses = async () => {
        try {
            const response = await fetch('/student/courses', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
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

    const fetchRegisteredCourses = async () => {
        try {
            const response = await fetch('/courses/registered', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRegisteredCourses(data);
            } else {
                console.error('Failed to fetch registered courses');
            }
        } catch (error) {
            console.error('Error fetching registered courses:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchCourses(), fetchRegisteredCourses()]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleCard = (stringId) => {
        setOpenCards(prev => 
            prev.includes(stringId) 
            ? prev.filter(id => id !== stringId) 
            : [...prev, stringId]
        );
    };

    const addToCart = (course) => {
        if (cartItems.some(item => item.string_id === course.string_id)) {
            enqueueSnackbar('Course is already selected', { variant: 'error' });
        } else if (hasScheduleConflict(course.schedule, cartItems, registeredCourses)) {
            enqueueSnackbar('Schedule conflict with existing courses', { variant: 'error' });
        } else {
            setCartItems(prev => [...prev, course]);
            enqueueSnackbar('Course added to cart', { variant: 'success' });
      }
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/student/registered', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ cartItems }),
            });
            const data = await response.json();

            if (data.errorMessage) {
                enqueueSnackbar(data.errorMessage, { variant: 'error' });
            } else {
                setCartItems([]);
                await fetchCourses();
                await fetchRegisteredCourses();
                enqueueSnackbar('Registration successful', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('Failed to register for course', { variant: 'error' });
        }
    };

    return (
        <div className='min-h-screen w-screen flex flex-col bg-cover'
            style={{ backgroundImage: `url(${backgroundImage})` }}>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <Header />
                    <div className='flex flex-col lg:flex-row p-4 lg:p-20'>
                        <div className="w-full lg:w-2/3 flex flex-col">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl shadow-md z-0" style={{ maxHeight: '75vh', overflow: 'hidden' }}></div>
                                <div className="relative z-10 custom-scrollbar overflow-y-auto rounded-3xl" style={{ maxHeight: '75vh' }}>
                                    <div className="flex flex-col space-y-6 p-4 lg:p-6">
                                        {courses.map(course => (
                                            <RegisterCard
                                                key={course.string_id}
                                                course={course}
                                                isOpen={openCards.includes(course.string_id)}
                                                toggleCard={() => toggleCard(course.string_id)}
                                                addToCart={() => addToCart({
                                                    title: course.title,
                                                    string_id: course.string_id,
                                                    cost: `$${course.tuition_cost}`,
                                                    schedule: course.schedule
                                                })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3 lg:mt-0 mt-4 lg:ml-8 flex justify-center lg:justify-end">
                            <div className="w-full max-w-md">
                                <div className="overflow-y-auto" style={{ maxHeight: '75vh' }}>
                                    <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} handleConfirmPayment={handleConfirmPayment} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Register;
