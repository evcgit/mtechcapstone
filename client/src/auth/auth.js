import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const useAuth = () => {
  const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          enqueueSnackbar('Session timed out. Please login again', { variant: 'error' });
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [navigate, enqueueSnackbar]); 
};

export const useAdminAuth = () => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const token = localStorage.getItem('token');
	console.log('token:',token);
	if (!token) {
		navigate('/');
	} else {
		try {
			const decodedToken = jwtDecode(token);
			if (!decodedToken.isAdmin) {
				navigate('/home');
			}
			const currentTime = Date.now() / 1000;
			if (decodedToken.exp < currentTime) {
				enqueueSnackbar('Session timed out. Please login again', { variant: 'error' });
				localStorage.removeItem('token');
				navigate('/');
			}
		} catch (error) {
			console.error('Invalid token:', error);
			localStorage.removeItem('token');
			navigate('/');
		}
	}
};

