import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../auth/auth';
import Card from '../../components/Card';
import Calendar from '../../components/Calender';
import backgroundImage from '../../assets/homebg.webp';

const Home = () => {
  useAuth();

	const [firstName, setFirstName] = useState('');

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
					alert(data.error);
				} else {
					setFirstName(data.first_name);
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		};
		fetchProfileInfo();
	}, []);


  const [springOpen, setSpringOpen] = useState(false);
  const [summerOpen, setSummerOpen] = useState(false);
  const [fallOpen, setFallOpen] = useState(false);

  const toggleSpring = () => setSpringOpen(!springOpen);
  const toggleSummer = () => setSummerOpen(!summerOpen);
  const toggleFall = () => setFallOpen(!fallOpen);

  return (
    <div className='h-screen flex flex-col bg-cover' 
         style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header />
      <div className='flex flex-grow'>
        {/* Calendar Container */}
        <div className='w-1/4 ml-12 rounded p-4 mt-4 h-5/6 bg-slate-100 overflow-hidden flex flex-col'>
          <h2 className='text-2xl text-center font-semibold mb-2'>{new Date().toLocaleDateString()}</h2>
          <Calendar />
        </div>

        {/* Main Content Area */}
        <div className='flex-1 ml-4 mr-12 mt-4 flex flex-col space-y-4'>
          {/* Welcome Bubble */}
          <div className='bg-white/20 backdrop-blur-md rounded-3xl shadow-md p-6 flex justify-center items-center'>
            <div className='text-white text-2xl font-bold'>
              Welcome {firstName}!
            </div>
          </div>
          
          {/* Cards Container */}
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
    </div>
  );
};

export default Home;