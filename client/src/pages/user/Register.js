import React, { useState, useEffect } from "react";
import Header from '../../components/user/Header';
import RegisterCard from '../../components/user/RegisterCard';
import ShoppingCart from '../../components/user/ShoppingCard'; 
import backgroundImage from '../../assets/registerbg.webp';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const Register = () => {
    const [openCards, setOpenCards] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
		const { enqueueSnackbar } = useSnackbar();

    const fetchCourses = async () => {
        try {
            const response = await fetch('/courses', {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTimeout(() => {
                    setCourses(data);
                    setLoading(false);
                }, 700);
            } else {
                console.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
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
        } else {
          enqueueSnackbar('Course is already selected', { variant: 'error' });
        }
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/courses/registered', {
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
                fetchCourses();
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
									                      cost: `$${course.tuition_cost}`
									                  })}
									              />
										          ))}
										        </div>
										      </div>
										    </div>
										</div>
                    <div className="w-full lg:w-1/3 lg:mt-0 mt-4lg:ml-8 flex justify-center lg:justify-end">
                      <div className="w-full max-w-md">
                        <div className="overflow-y-auto" style={{maxHeight: '75vh' }}>
                          <ShoppingCart cartItems={cartItems}setCartItems={setCartItems} handleConfirmPayment={handleConfirmPayment} />
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
