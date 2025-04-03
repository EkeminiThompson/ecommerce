import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const PRODUCTS_API_URL = `${API_BASE_URL}/products`;

// Fallback product categories and their corresponding placeholder images
const FALLBACK_IMAGES = {
  electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  books: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  default: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
};

// Modified Product component with image fallback
const ProductWithFallback = ({ product }) => {
  const handleImageError = (e) => {
    const category = product.category?.toLowerCase() || 'default';
    const fallbackImage = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
    e.target.src = fallbackImage;
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
  };

  return (
    <div className="product">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          onError={handleImageError}
          className="img-fluid rounded"
        />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(PRODUCTS_API_URL);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1 className="my-3">Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <ProductWithFallback product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomePage;