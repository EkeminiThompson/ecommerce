import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/common/FormContainer';
import { saveShippingAddress } from '../redux/actions/cartActions';

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Initialize form state with proper defaults
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Load saved shipping address when component mounts
  useEffect(() => {
    if (shippingAddress) {
      setFormData({
        address: shippingAddress.address || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || ''
      });
    }
  }, [shippingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // Save shipping address to Redux store
    dispatch(saveShippingAddress(formData));
    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <FormContainer>
      <h1 className="mb-4">Shipping Details</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            placeholder="Enter street address"
            value={formData.address}
            required
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="city" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            required
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="postalCode" className="mb-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            name="postalCode"
            placeholder="Enter postal/zip code"
            value={formData.postalCode}
            required
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="country" className="mb-4">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            placeholder="Enter country"
            value={formData.country}
            required
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-grid">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
          >
            Continue to Payment
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;