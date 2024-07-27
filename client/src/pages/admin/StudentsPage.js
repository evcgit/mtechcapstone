import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdminAuth } from '../../auth/auth';
import backgroundImage from '../../assets/registerbg.webp';


const Students = () => {
	useAdminAuth();


	return (
		<div style={{backgroundImage: `url(${backgroundImage})`}} className='bg-cover min-h-screen w-screen'>
		<AdminHeader />
	</div>
	)
};

export default Students;