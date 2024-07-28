import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import { useAuth } from '../../auth/auth';
import Calendar from '../../components/user/Calender';
import backgroundImage from '../../assets/homebg.webp';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSnackbar } from 'notistack';
import verticleDots from '../../assets/vertical-dots.svg';

const Home = () => {
  useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [conflictError, setConflictError] = useState('');

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
        if (errorData.errorMessage) {
          setConflictError(errorData.errorMessage); // Set the conflict error
          return; // Stop further processing if there is a conflict error
        }
        throw new Error(errorData.error || 'Error removing course');
      }

      const data = await response.json();
      enqueueSnackbar(data.message, { variant: 'success' });

      setRegisteredCourses((prevCourses) =>
        prevCourses.filter(course => course.string_id !== courseId)
      );
      setDropdownOpen(null);
      setConflictError(''); // Clear any conflict error if removal is successful
    } catch (error) {
      console.error('Error removing course:', error);
      enqueueSnackbar(`Error removing course: ${error.message}`, { variant: 'error' });
    }
  };

  const handleDropdownToggle = (courseId) => {
    setDropdownOpen(prev => (prev === courseId ? null : courseId));
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
          <div className='flex flex-col lg:flex-row lg:space-x-8 p-6 lg:p-8 h-full'>
            <div className='flex-1 lg:w-1/3 bg-white/80 rounded-lg p-6 lg:p-8 shadow-lg flex flex-col'>
              {/* Calendar */}
              <h2 className='text-lg lg:text-xl text-center font-semibold mb-2 text-gray-700'>{dayName}</h2>
              <h2 className='text-xl lg:text-2xl text-center font-semibold mb-4 text-gray-800'>{today.toLocaleDateString()}</h2>
              <div className='flex-1 overflow-auto custom-scrollbar'>
                <Calendar />
              </div>
            </div>
            <div className='lg:w-1/6'></div>
            <div className='flex-1 lg:w-1/2 flex flex-col space-y-4'>
              {/* Welcome */}
              <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 flex justify-center items-center'>
                <p className='text-gray-800 text-2xl font-bold'>
                  Welcome, {firstName}!
                </p>
              </div>
              {/* Registered Courses */}
              <div className='p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg flex flex-col max-h-[400px]'>
                <h3 className='text-xl font-semibold mb-4 text-gray-700'>Registered Courses</h3>
                {conflictError && (
                  <p className='text-red-600 mb-4'>{conflictError}</p> // Display conflict error
                )}
                <ul className='relative overflow-y-auto custom-scrollbar space-y-2'>
                  {registeredCourses.length > 0 ? (
                    registeredCourses.map(course => (
                      <li key={course.string_id} className='flex items-center justify-between p-4 bg-white rounded-lg shadow-md relative'>
                        <span className='text-gray-800'>{course.title} - {course.schedule}</span>
                        <div className='flex items-center space-x-2'>
                          {dropdownOpen === course.string_id && (
                            <div className="absolute right-10 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => handleRemoveCourse(course.string_id)}
                                className="w-full px-4 py-2 text-red-600 focus:outline-none text-left"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleDropdownToggle(course.string_id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <img src={verticleDots} alt="Options" className='w-6 h-6'/>
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className='text-gray-600'>No registered courses.</p>
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
