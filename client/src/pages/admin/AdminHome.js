import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { useAdminAuth } from '../../auth/auth';

const AdminHome = () => {
	useAdminAuth();
	return (
		<AdminHeader />
	)
}

export default AdminHome;