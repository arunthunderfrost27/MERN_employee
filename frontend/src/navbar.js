import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function AppNavbar({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the provided onLogout function to clear the user state
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Dashboard</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/employee-form">Add Employee</Nav.Link>
        </Nav>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/employee-list">Employee List</Nav.Link>
        </Nav>
        <Navbar.Text className="mr-3">
          Signed in as: <strong>{username}</strong>
        </Navbar.Text>
        <Button variant="outline-light" onClick={handleLogout}>Sign out</Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
