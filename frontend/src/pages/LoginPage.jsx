import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import Loader from '../components/common/Loader';
import FormContainer from '../components/common/FormContainer';

// Backend API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const LOGIN_URL = `${API_BASE_URL}/auth/login`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', variant: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split('=')[1] : '/';

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ text: '', variant: '' });

    try {
      const response = await axios.post(LOGIN_URL, {
        email: formData.email,
        password: formData.password
      });

      // Store user data in localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      localStorage.setItem('authToken', response.data.token);

      setMessage({ 
        text: 'Login successful', 
        variant: 'success' 
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate(redirect);
      }, 1000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Login failed. Please try again.',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', variant: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <FormContainer>
      <h1 className="text-center mb-4">Sign In</h1>
      
      {message.text && (
        <Alert variant={message.variant} className="text-center">
          {message.text}
        </Alert>
      )}
      
      {loading && <Loader />}
      
      <Form onSubmit={submitHandler} noValidate>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!validationErrors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!validationErrors.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-100 mt-3 py-2"
          disabled={loading}
        >
          {loading ? (
            <span>Signing In...</span>
          ) : (
            <span>Sign In</span>
          )}
        </Button>
      </Form>

      <Row className="py-3 text-center">
        <Col>
          <span className="me-2">Don't have an account?</span>
          <Link 
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="fw-bold"
          >
            Register
          </Link>
        </Col>
      </Row>
      
      <Row className="text-center">
        <Col>
          <Link to="/forgot-password" className="text-muted">
            Forgot your password?
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;