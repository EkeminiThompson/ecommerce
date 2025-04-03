import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, Form, Button, Alert } from 'react-bootstrap';

// Backend API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const ENDPOINTS = {
  CREATE_ADMIN: `${API_BASE_URL}/auth/create-admin`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  CREATE_PRODUCT: `${API_BASE_URL}/products`
};

const AdminPage = () => {
  const navigate = useNavigate();
  
  // Tab management
  const [activeTab, setActiveTab] = useState('createAdmin');
  
  // Form states
  const [adminData, setAdminData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
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
    setLoading(true);
    
    try {
      const response = await axios.post(ENDPOINTS.CREATE_ADMIN, {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password
      });
      
      setMessage({ text: response.data.message, variant: 'success' });
      setAdminData({ name: '', email: '', password: '' });
      setActiveTab('login'); // Switch to login tab
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Admin creation failed', 
        variant: 'danger' 
      });
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
      setActiveTab('products'); // Switch to products tab
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Login failed', 
        variant: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle product creation
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(ENDPOINTS.CREATE_PRODUCT, {
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
      
      setMessage({ 
        text: 'Product created successfully', 
        variant: 'success' 
      });
      
      // Reset product form
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
      setMessage({ 
        text: error.response?.data?.message || 'Product creation failed', 
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

  // Check authentication on load
  useEffect(() => {
    if (authToken && adminInfo) {
      setActiveTab('products');
    }
  }, [authToken, adminInfo]);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
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
                required
              />
            </Form.Group>
            
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin'}
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
              {loading ? 'Logging in...' : 'Login'}
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
                  type="text"
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
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
            </Form>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminPage;