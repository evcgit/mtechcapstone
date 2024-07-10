import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
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
};

export default useAuth;
