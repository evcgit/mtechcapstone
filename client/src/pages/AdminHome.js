import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import { useAdminAuth } from '../auth/auth';

const AdminHome = ({ first_name }) => {
	useAdminAuth();
	return (
		<AdminHeader />
	)
}

export default AdminHome;