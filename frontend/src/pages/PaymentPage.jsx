import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/common/FormContainer';
import { savePaymentMethod } from '../redux/actions/cartActions';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod: savedPaymentMethod } = cart;

  const [paymentMethod, setPaymentMethod] = useState(
    savedPaymentMethod || localStorage.getItem('paymentMethod') || 'PayPal'
  );
  const [error, setError] = useState('');

  // Check for shipping address and redirect if missing
  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // Save to both Redux and localStorage
    dispatch(savePaymentMethod(paymentMethod));
    localStorage.setItem('paymentMethod', paymentMethod);
    
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <h1 className="mb-4">Payment Method</h1>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-4">
          <Form.Label as="legend" className="fw-bold mb-3">Select Payment Method</Form.Label>
          <Col>
            <div className="mb-3">
              <Form.Check
                type="radio"
                label={
                  <>
                    <i className="fab fa-paypal me-2"></i>
                    PayPal or Credit Card
                  </>
                }
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setError('');
                }}
              />
            </div>
            
            <div className="mb-3">
              <Form.Check
                type="radio"
                label={
                  <>
                    <i className="far fa-credit-card me-2"></i>
                    Credit/Debit Card (Stripe)
                  </>
                }
                id="Stripe"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setError('');
                }}
              />
            </div>
          </Col>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            disabled={!paymentMethod}
          >
            Continue to Place Order
          </Button>
          
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={() => navigate('/shipping')}
          >
            Back to Shipping
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;