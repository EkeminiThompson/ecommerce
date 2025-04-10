import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, Form, Button, Alert, Spinner } from 'react-bootstrap';

// Backend API Configuration from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TIMEOUT = parseInt(process.env.REACT_APP_DEFAULT_TIMEOUT) || 5000;

const ENDPOINTS = {
  CREATE_ADMIN: `${API_BASE_URL}${process.env.REACT_APP_CREATE_ADMIN_ENDPOINT}`,
  LOGIN: `${API_BASE_URL}${process.env.REACT_APP_LOGIN_ENDPOINT}`,
  PRODUCTS: `${API_BASE_URL}${process.env.REACT_APP_PRODUCTS_ENDPOINT}`
};

// Configure axios defaults
axios.defaults.timeout = API_TIMEOUT;

const AdminPage = () => {
  const navigate = useNavigate();
  
  // Tab management
  const [activeTab, setActiveTab] = useState('login');
  
  // Form states
  const [adminData, setAdminData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '' 
  });
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: ''
  });
  
  // App state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
  const [adminInfo, setAdminInfo] = useState(JSON.parse(localStorage.getItem('adminInfo')) || null);

  // Handle admin creation
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (adminData.password !== adminData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', variant: 'danger' });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(ENDPOINTS.CREATE_ADMIN, {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password
      });
      
      setMessage({ text: response.data.message, variant: 'success' });
      setAdminData({ name: '', email: '', password: '', confirmPassword: '' });
      setActiveTab('login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Admin creation failed';
      setMessage({ text: errorMessage, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, {
        email: loginData.email,
        password: loginData.password
      });
      
      const { token, ...adminData } = response.data;
      
      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('adminInfo', JSON.stringify(adminData));
      setAuthToken(token);
      setAdminInfo(adminData);
      
      setMessage({ text: 'Login successful', variant: 'success' });
      setLoginData({ email: '', password: '' });
      setActiveTab('products');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Login failed';
      setMessage({ text: errorMessage, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Handle product creation
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(ENDPOINTS.PRODUCTS, {
        name: productData.name,
        price: parseFloat(productData.price),
        description: productData.description,
        image: productData.image,
        brand: productData.brand,
        category: productData.category,
        countInStock: parseInt(productData.countInStock)
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMessage({ text: 'Product created successfully', variant: 'success' });
      
      // Reset form
      setProductData({
        name: '',
        price: '',
        description: '',
        image: '',
        brand: '',
        category: '',
        countInStock: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Product creation failed';
      setMessage({ text: errorMessage, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    setAuthToken('');
    setAdminInfo(null);
    setActiveTab('login');
    setMessage({ text: 'Logged out successfully', variant: 'success' });
  };

  // Clear messages after timeout
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', variant: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check authentication on load
  useEffect(() => {
    if (authToken && adminInfo) {
      setActiveTab('products');
    }
  }, [authToken, adminInfo]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        {authToken && (
          <div>
            <span className="me-3">Welcome, {adminInfo?.name}</span>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
      
      {message.text && (
        <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })}>
          {message.text}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        {/* Create Admin Tab */}
        <Tab eventKey="createAdmin" title="Create Admin" disabled={!!authToken}>
          <Form onSubmit={handleCreateAdmin} className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label>Admin Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter admin name"
                value={adminData.name}
                onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Admin Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter admin email"
                value={adminData.email}
                onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={adminData.password}
                onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                minLength="6"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={adminData.confirmPassword}
                onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})}
                minLength="6"
                required
              />
            </Form.Group>
            
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                  Creating...
                </>
              ) : 'Create Admin'}
            </Button>
          </Form>
        </Tab>

        {/* Login Tab */}
        <Tab eventKey="login" title="Admin Login" disabled={!!authToken}>
          <Form onSubmit={handleLogin} className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter admin email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </Form.Group>
            
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                  Logging in...
                </>
              ) : 'Login'}
            </Button>
          </Form>
        </Tab>

        {/* Create Product Tab */}
        <Tab eventKey="products" title="Manage Products" disabled={!authToken}>
          <div className="mt-4">
            <h3>Create New Product</h3>
            <Form onSubmit={handleCreateProduct}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={productData.name}
                  onChange={(e) => setProductData({...productData, name: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={productData.price}
                  onChange={(e) => setProductData({...productData, price: e.target.value})}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={productData.description}
                  onChange={(e) => setProductData({...productData, description: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter image URL"
                  value={productData.image}
                  onChange={(e) => setProductData({...productData, image: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter brand"
                  value={productData.brand}
                  onChange={(e) => setProductData({...productData, brand: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter count in stock"
                  value={productData.countInStock}
                  onChange={(e) => setProductData({...productData, countInStock: e.target.value})}
                  min="0"
                  required
                />
              </Form.Group>
              
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                    Creating...
                  </>
                ) : 'Create Product'}
              </Button>
            </Form>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminPage;