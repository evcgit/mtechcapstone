import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
	const [data, setData] = React.useState(null);
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const navigate = useNavigate();

	React.useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => setData(data.message));
	}, []);



	const handleSubmit = (e) => {
		e.preventDefault();

		const userData = {
			username: username,
			password: password,
		};

		fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.errorMessage) {
					alert(data.errorMessage);
				}
				else {
					localStorage.setItem('token', data.token);
					navigate('/home');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
	<div className='flex justify-center items-center h-screen bg-gray-600'>
			<div className='bg-white p-6 rounded-lg shadow-lg'>
				<h1 className='text-2xl font-bold mb-4 text-center'> {data ? data : "Pending backend startup"} </h1>
    			<form className='flex flex-col' onSubmit={handleSubmit}>
					<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder='Username'className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none'/>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder='Password'className='border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none'/>
					<input type="submit" value="Login" className='bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded mb-3 transition duration-300 ease-in-out'/>
				</form>
				<p className='text-gray-700 text-sm text-center'>Don't have an account? <a href='/register' className='text-blue-500 hover:underline'>Register here</a></p>
			</div>
	</div>
);
}

export default Login;