import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EmployeeForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('HR');
  const [gender, setGender] = useState('Male');
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleCourseChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCourses([...courses, value]);
    } else {
      setCourses(courses.filter(course => course !== value));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile); // Ensures mobile number is exactly 10 digits
  };

  const validateForm = () => {
    if (!name || !email || !mobile || !designation || !gender || courses.length === 0 || !image) {
      setMessage('All fields are required');
      return false;
    }

    if (!validateEmail(email)) {
      setMessage('Invalid email format');
      return false;
    }

    if (!validateMobile(mobile)) {
      setMessage('Mobile number must be exactly 10 digits');
      return false;
    }

    if (!image.name.match(/\.(jpg|jpeg|png)$/)) {
      setMessage('Only JPG/PNG images are allowed');
      return false;
    }

    setMessage('');
    return true;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.match(/\.(jpg|jpeg|png)$/)) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage(''); // Clear any previous error messages related to file type
    } else {
      setMessage('The image uploaded must be in JPG/PNG format');
      setImage(null);
      setImagePreview('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('f_Name', name);
    formData.append('f_Email', email);
    formData.append('f_Mobile', mobile);
    formData.append('f_Designation', designation);
    formData.append('f_Gender', gender);
    formData.append('f_Course', courses.join(', '));
    formData.append('f_Image', image);

    fetch('http://localhost:5001/employees', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Employee details submitted successfully');
          navigate('/dashboard'); // Redirect to dashboard upon successful submission
        }
      })
      .catch(error => {
        setMessage('Failed to submit employee details');
        console.error('Error:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={4}>
          <h1 className="text-center mb-4">Employee Form</h1>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                placeholder="Employee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Control
                type="email"
                value={email}
                placeholder="Email ID"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMobile" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Mobile No"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDesignation" className="mt-3">
              <Form.Label>Designation:</Form.Label>
              <Form.Control
                as="select"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="" disabled>Select designation</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formGender" className="mt-3">
              <Form.Label>Gender:</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Male"
                  value="Male"
                  checked={gender === 'Male'}
                  onChange={(e) => setGender(e.target.value)}
                  inline
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  value="Female"
                  checked={gender === 'Female'}
                  onChange={(e) => setGender(e.target.value)}
                  inline
                />
              </div>
            </Form.Group>
            <Form.Group controlId="formCourses" className="mt-3">
              <Form.Label>Courses:</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  label="MCA"
                  value="MCA"
                  onChange={handleCourseChange}
                  inline
                />
                <Form.Check
                  type="checkbox"
                  label="BCA"
                  value="BCA"
                  onChange={handleCourseChange}
                  inline
                />
                <Form.Check
                  type="checkbox"
                  label="B.Sc"
                  value="B.Sc"
                  onChange={handleCourseChange}
                  inline
                />
              </div>
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image (JPG/PNG only):</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4 w-100">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
