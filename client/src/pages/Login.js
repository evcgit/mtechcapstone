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

		console.log(userData);
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
		<div className='flex justify-center flex-col content-center items-center h-screen bg-gray-600'>
			<h1> {data ? data : "Pending backend startup"} </h1>
    	<form className='flex flex-col' onSubmit={handleSubmit}>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder='Username'className='border-2 border-black rounded mb-2 p-1'/>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder='Password'className='border-2 border-black rounded mb-2 p-1'/>
				<input type="submit" value="Submit" className='bg-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded'/>
			</form>
		</div>
  );
}

export default Login;