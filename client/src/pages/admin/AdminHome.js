import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdminAuth } from '../../auth/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminCourses from '../../components/admin/AdminCourses'; 
import backgroundImage from '../../assets/homebg.webp'; 
import NewCourse from '../../components/admin/NewCourse';

const AdminHome = () => {
    useAdminAuth();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [openCards, setOpenCards] = useState([]);

    const fetchCourses = async () => {
      try {
          const response = await fetch('/admin/courses', {
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

    const toggleCard = (string_id) => {
        setOpenCards((prevOpenCards) => 
            prevOpenCards.includes(string_id) 
                ? prevOpenCards.filter((id) => id !== string_id) 
                : [...prevOpenCards, string_id]
        );
    };


    return (
        <div className='min-h-screen w-screen flex flex-col bg-cover'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <AdminHeader />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className='flex flex-col lg:flex-row lg:justify-between p-4 lg:p-20'>
                    <div className="w-full lg:w-2/3 flex flex-col">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl shadow-md z-0" style={{ maxHeight: '75vh', overflow: 'hidden' }}></div>
                            <div className="relative z-10 custom-scrollbar overflow-y-auto rounded-3xl" style={{ maxHeight: '75vh' }}>
                                <div className="flex flex-col space-y-6 p-4 lg:p-6">
                                    {courses.map(course => (
                                        <AdminCourses
																					key={course.string_id}
                                          course={course}
                                          isOpen={openCards.includes(course.string_id)}
                                          toggleCard={() => toggleCard(course.string_id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
										<div className="w-full lg:w-1/3 lg:mt-0 mt-4 lg:ml-8 flex justify-center lg:justify-end">
                    <NewCourse />
										</div>
                </div>
            )}
        </div>
    )
}

export default AdminHome;
