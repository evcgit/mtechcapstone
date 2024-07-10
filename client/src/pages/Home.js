import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
// import Header from '../components/Header';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view this page');
      navigate('/');
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [navigate]);

  return (
    <>
    </>
		// <Header />
  );
};

export default Home;
