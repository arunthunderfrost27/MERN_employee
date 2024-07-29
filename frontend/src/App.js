import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Register from './register';
import Dashboard from './dashboard';
import EmployeeList from './employee-list';
import EmployeeForm from './employeeform';
import EmployeeEdit from './employee-edit'; 
import AppNavbar from './navbar'; 

function App() {
  const [username, setUsername] = useState(''); 

  const handleLogout = () => {
    setUsername(''); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register setUsername={setUsername} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute username={username}>
              <DashboardWrapper username={username} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/employee-list" element={<ProtectedRoute username={username}><EmployeeList /></ProtectedRoute>} />
        <Route path="/employee-form" element={<ProtectedRoute username={username}><EmployeeForm /></ProtectedRoute>} />
        <Route path="/employee-edit/:id" element={<ProtectedRoute username={username}><EmployeeEdit /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

function DashboardWrapper({ username, onLogout }) {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/dashboard' && (
        <AppNavbar username={username} onLogout={onLogout} />
      )}
      <Dashboard />
    </>
  );
}

// ProtectedRoute component to manage authentication
function ProtectedRoute({ username, children }) {
  if (!username) {
    return <Navigate to="/" />;
  }
  return children;
}

export default App;
