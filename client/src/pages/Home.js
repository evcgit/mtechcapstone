import React from 'react';
import Header from '../components/Header';
import useAuth from '../auth/auth';

const Home = () => {
  useAuth();

  return (
		<Header />
  );
};

export default Home;
