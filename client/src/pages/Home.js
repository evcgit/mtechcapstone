import React, { useState } from 'react';
import Header from '../components/Header';
import useAuth from '../auth/auth';
import Card from '../components/Card';

const Home = () => {
  useAuth();

  const [springOpen, setSpringOpen] = useState(false);
  const [summerOpen, setSummerOpen] = useState(false);
  const [fallOpen, setFallOpen] = useState(false);

  const toggleSpring = () => setSpringOpen(!springOpen);
  const toggleSummer = () => setSummerOpen(!summerOpen);
  const toggleFall = () => setFallOpen(!fallOpen);

  return (
    <div className='bg-gray-800 h-screen flex flex-col'>
      <Header />
      <div className='w-screen mt-10 flex h-5/6'>
        <div className='w-1/4 ml-12 rounded h-5/6 p-4 bg-slate-100'>
          <h1 className='text-2xl font-semibold mb-4'>Today's Date</h1>
          {/* Calendar will go here */}
        </div>
        <div className='flex flex-col space-y-4 w-2/3 ml-10'>
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
  );
};

export default Home;
