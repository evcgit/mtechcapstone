import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import { useAuth } from '../../auth/auth';
import Calendar from '../../components/user/Calender';
import backgroundImage from '../../assets/homebg.webp';
import LoadingSpinner  from '../../components/LoadingSpinner';
import { useSnackbar } from 'notistack';



const Home = () => {
  useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      fetch('/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          enqueueSnackbar(data.error, { variant: 'error' });
        } else {
          setTimeout(() => {
            setFirstName(data.first_name);
            setLoading(false); 
          }, 800); 
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        enqueueSnackbar('Error', error, { variant: 'error' });
      });
    };
    fetchProfileInfo();
  }, [enqueueSnackbar]);

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
          <div className='flex flex-col lg:flex-row lg:space-x-4 p-4 lg:p-8 h-full'>
            <div className='flex-1 lg:w-1/4 bg-slate-100 rounded-lg p-4 h-full flex flex-col'>
              <h2 className='text-lg lg:text-xl text-center font-semibold mb-2'>{dayName}</h2>
              <h2 className='text-xl lg:text-2xl text-center font-semibold mb-2'>{today.toLocaleDateString()}</h2>
              <div className='flex-1 overflow-y-auto'>
                <Calendar />
              </div>
            </div>
            <div className='flex-1 ml-4 mr-12 mt-4 flex flex-col space-y-4 max-xl:w-11/12 max-xl:ml-4'>
              <div className='bg-white/20 backdrop-blur-md rounded-3xl shadow-md p-6 flex justify-center items-center'>
                <p className='text-white text-2xl font-bold'>
                  Welcome {firstName}!
                </p>
              </div>
              <div className='p-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-md flex flex-col'>
                {/* Your other components go here */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

