import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import { useAuth } from '../../auth/auth';
import Calendar from '../../components/user/Calender';
import backgroundImage from '../../assets/homebg.webp';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const Home = () => {
  useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const profileRes = await fetch('/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const profileData = await profileRes.json();
        
        if (profileData.error) {
          enqueueSnackbar(profileData.error, { variant: 'error' });
        } else {
          setFirstName(profileData.first_name);
        }
      } catch (error) {
        console.error('Error:', error);
        enqueueSnackbar('Error fetching profile', { variant: 'error' });
      }
    };

    const fetchRegisteredCourses = async () => {
      try {
        const coursesRes = await fetch('/courses/schedule', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const coursesData = await coursesRes.json();

        if (coursesData.error) {
          enqueueSnackbar(coursesData.error, { variant: 'error' });
        } else {
          setRegisteredCourses(coursesData);
        }
      } catch (error) {
        console.error('Error:', error);
        enqueueSnackbar('Error fetching courses', { variant: 'error' });
      }
    };

    const fetchData = async () => {
      await fetchProfileInfo();
      await fetchRegisteredCourses();
      setLoading(false); 
    };

    fetchData();
  }, [enqueueSnackbar]);

  const handleRemoveCourse = async (courseId) => {
    try {
      const response = await fetch(`/courses/remove/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error removing course');
      }

      const data = await response.json();
      enqueueSnackbar(data.message, { variant: 'success' });
      
      setRegisteredCourses((prevCourses) =>
        prevCourses.filter(course => course.string_id !== courseId)
      );
    } catch (error) {
      console.error('Error removing course:', error);
      enqueueSnackbar(`Error removing course: ${error.message}`, { variant: 'error' });
    }
  };

  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[today.getDay()];

  return (
    <div className='h-screen flex flex-col bg-cover bg-center' 
        style={{ backgroundImage: `url(${backgroundImage})` }}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header />
          <div className='flex flex-col lg:flex-row lg:space-x-8 p-4 lg:p-8 h-full justify-between'>
            <div className='flex-1 lg:w-1/3 bg-slate-100 rounded-lg p-4 h-5/6 flex flex-col'> {/* Calendar */}
              <h2 className='text-lg lg:text-xl text-center font-semibold mb-2'>{dayName}</h2>
              <h2 className='text-xl lg:text-2xl text-center font-semibold mb-2'>{today.toLocaleDateString()}</h2>
              <div className='flex-1 overflow-auto'>
                <Calendar />
              </div>
            </div>
            <div className='lg:w-1/6'></div>
            <div className='flex-1 lg:w-1/2 flex flex-col space-y-4'> {/* Welcome and Registered Courses */}
              <div className='bg-white/60 backdrop-blur-md rounded-3xl shadow-md p-6 flex justify-center items-center'>
                <p className='text-gray-800 text-2xl font-bold'>
                  Welcome {firstName}!
                </p>
              </div>
              <div className='p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-md flex flex-col h-96 custom-scrollbar'>
                <h3 className='text-xl font-semibold mb-4'>Registered Courses</h3>
                <ul className='overflow-y-auto space-y-2 custom-scrollbar'>
                  {registeredCourses.length > 0 ? (
                    registeredCourses.map(course => (
                      <li key={course.string_id} className='flex items-center justify-between p-2 bg-white rounded-lg shadow-md'>
                        <span>{course.title} - {course.schedule}</span>
                        <button 
                          onClick={() => handleRemoveCourse(course.string_id)}
                          className='bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600'>
                          Remove
                        </button>
                      </li>
                    ))
                  ) : (
                    <p>No registered courses.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
