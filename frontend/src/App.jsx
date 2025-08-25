import React, { useContext } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import Editor from './components/Editor';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider, AuthContext } from './components/AuthContext';

const AppRoutes = () => {
  const { user} = useContext(AuthContext);

  // console.log("this one is from home",user);

  // if (loading) return <div>Loading...</div>; 

  return (
    <Routes>
      <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/editor/:roomId" element={user ? <Editor /> : <Navigate to="/signin" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
