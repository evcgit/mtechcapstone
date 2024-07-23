import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/user/Login';
import Home from './pages/user/Home';
import CreateAccount from './pages/user/CreateAccount';
import Profile from './pages/user/Profile';
import Register from './pages/user/Register';
import AdminHome from './pages/admin/AdminHome';
import Students from './pages/admin/Students';

const AppContent = () => {

  return (
      <Routes>
        <Route path="/" element={<Login />} />
				<Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/home" element={<AdminHome />} />
				<Route path="/register" element={<Register />} />
				<Route path='/students' element={<Students />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
