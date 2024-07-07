import React from 'react';

function App() {
	const [data, setData] = React.useState(null);

	React.useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => setData(data.message));
	}, []);

  return (
		<div className='flex justify-center flex-col content-center items-center h-screen bg-gray-600'>
			<h1> {data ? data : "Pending backend startup"} </h1>
    	<form className='flex flex-col'>
				<input type="text" name="username" placeholder='Username'className='border-2 border-black rounded mb-2 p-1'/>
				<input type="password" name="password" placeholder='Password'className='border-2 border-black rounded mb-2 p-1'/>
				<input type="submit" value="Submit" className='bg-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded'/>
			</form>
		</div>
  );
}

export default App;
