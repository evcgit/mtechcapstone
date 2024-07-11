import react from "react";
import Header from '../components/Header';
import useAuth from '../auth/auth';

const Register = () => {
    useAuth();
    return (
        <>
            <div className='bg-gray-900 h-screen w-screen flex flex-col'>
                <Header />
                <div className='flex items-center justify-center h-screen'>
                    </div>
            </div>
        </>
    )
}

export default Register;