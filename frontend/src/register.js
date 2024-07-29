import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import logo from './react.png'; 

export default function Register({ setUsername }) {
    const [username, setLocalUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); 

    const submit = () => {
        setError("");
        setSuccess("");

        if (username.trim() !== '' && password.trim() !== '') {
            fetch("http://localhost:5001/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSuccess("Details added successfully");
                    setLocalUsername(""); // Clear local username state
                    setPassword("");
                    setUsername(username); // Set username in parent state
                    navigate('/dashboard'); // Redirect to dashboard
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError("Unable to add to the database");
            });
        } else {
            setError("Username and password cannot be empty");
        }
    };

    return (
        <Container>
            <Col className="d-flex justify-content-start mt-4">
                <img src={logo} alt="Logo" style={{ height: '50px' }} />
                <h2>MERN Portal</h2>
            </Col>
            <Row className="justify-content-md-center mt-5 ">
                <Col md={6} lg={4}>
                    <h1 className="text-center mb-4 text-success">Register</h1>
                    <Form>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setLocalUsername(e.target.value)}
                                className="mb-3"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-3"
                            />
                        </Form.Group>

                        <Button variant="dark" type="button" onClick={submit} className="w-100">
                            Submit
                        </Button>
                    </Form>
                    {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Col>
            </Row>
        </Container>
    );
}
