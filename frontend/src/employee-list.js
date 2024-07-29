import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    // Fetch employee data on component mount
    useEffect(() => {
        fetch('http://localhost:5001/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
            })
            .catch(err => {
                console.error('Error fetching employee data:', err);
            });
    }, []);

    const handleDelete = (id) => {
        // Handle delete action
        fetch(`http://localhost:5001/employees/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setEmployees(employees.filter(emp => emp._id !== id));
                }
            })
            .catch(err => {
                console.error('Error deleting employee:', err);
            });
    };

    const handleDeleteAll = () => {
        // Handle delete all action
        fetch('http://localhost:5001/employees', {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setEmployees([]); // Clear the employee list
                }
            })
            .catch(err => {
                console.error('Error deleting all employees:', err);
            });
    };

    const handleEdit = (id) => {
        // Redirect to the edit page with the employee ID
        navigate(`/employee-edit/${id}`);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Employee List</h1>
            <Button
                variant="danger"
                onClick={handleDeleteAll}
                className="mb-4"
            >
                Delete All Employees
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Create Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee._id}>
                            <td>{employee.f_Id}</td>
                            <td>
                                {employee.f_Image && (
                                    <img
                                        src={`http://localhost:5001/uploads/${employee.f_Image}`}
                                        alt="Employee"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                )}
                            </td>
                            <td>{employee.f_Name}</td>
                            <td>{employee.f_Email}</td>
                            <td>{employee.f_Mobile}</td>
                            <td>{employee.f_Designation}</td>
                            <td>{employee.f_Gender}</td>
                            <td>{employee.f_Course.join(', ')}</td>
                            <td>{new Date(employee.f_CreateDate).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEdit(employee._id)}
                                    className="me-2"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(employee._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
