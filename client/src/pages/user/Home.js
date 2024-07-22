import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../auth/auth';
import Card from '../../components/Card';
import Calendar from '../../components/Calender';
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


  const [springOpen, setSpringOpen] = useState(false);
  const [summerOpen, setSummerOpen] = useState(false);
  const [fallOpen, setFallOpen] = useState(false);

  const toggleSpring = () => setSpringOpen(!springOpen);
  const toggleSummer = () => setSummerOpen(!summerOpen);
  const toggleFall = () => setFallOpen(!fallOpen);

  return (
    <div className='h-screen flex flex-col bg-cover bg-center' 
         style={{ backgroundImage: `url(${backgroundImage})` }}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
      <Header />
      <div className='flex flex-grow max-xl:flex-col'>
        <div className='w-1/4 ml-12 rounded p-4 mt-4 h-5/6 max-xl:w-11/12 max-xl:ml-4 bg-slate-100 overflow-hidden flex flex-col'>
          <h2 className='text-2xl text-center font-semibold mb-2'>{new Date().toLocaleDateString()}</h2>
          <Calendar />
        </div>

        <div className='flex-1 ml-4 mr-12 mt-4 flex flex-col space-y-4 max-xl:w-11/12 max-xl:ml-4'>
          <div className='bg-white/20 backdrop-blur-md rounded-3xl shadow-md p-6 flex justify-center items-center'>
            <p className='text-white text-2xl font-bold'>
              Welcome {firstName}!
            </p>
          </div>
          
          <div className='p-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-md flex flex-col'>
            <div className='flex flex-col flex-grow space-y-4'>
              <Card
                title='Spring'
                isOpen={springOpen}
                toggleCard={toggleSpring}
              />
              <Card
                title='Summer'
                isOpen={summerOpen}
                toggleCard={toggleSummer}
              />
              <Card
                title='Fall'
                isOpen={fallOpen}
                toggleCard={toggleFall}
              />
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Home;
