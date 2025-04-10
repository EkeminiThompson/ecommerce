import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PRODUCTS_API_URL = `${API_BASE_URL}${process.env.REACT_APP_PRODUCTS_ENDPOINT}`;

// Fixed fallback clothing images
const RANDOM_CLOTHING_IMAGES = [
  'https://image.made-in-china.com/2f0j00gKOWlrVaghoz/OEM-Women-s-Suit-Business-Fashion-Ol-Femininity-Beauty-Salon-Work-Clothes.webp',
  'https://lh3.googleusercontent.com/proxy/1PhcT-loM4wvdWxGzzrffStjA03O7wgqqDuNaRQ_JOhDJvLNYFbW9MwUrAcKG5v6IBFhkT02uiIGFMorNn_YKCKlyg2RdaXgfDENxZERFdZXDWz3TG3YOVw1SJiJ42-y4JcqN11NUzJoktXdpFaIjDtI2FNRDAyZ5yxB0pc4krVoRASo6CA4nJ-ym6W6V9c0LIJNNeoUxzpDwK_v0G0ZX6vSua1QhiRpJnoNQFKi6tYilgWC2NbPuoPIsQKVU4XK7MJWmhzbNOdreJaAvebUYJO5W8RXpAXAIAXgeg',
  'https://i.pinimg.com/736x/89/9e/81/899e810c82fca8ad12fe60a31790132d.jpg',
  'https://www.instyle.com/thmb/DbZ3LYMaQh85P9rZtC6jqOkAUs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1464932922-07bdecc7f9354e91932caaaf4d21afe7.jpg',
  'https://i.pinimg.com/736x/15/ee/21/15ee21005a300a180aa81d3f99056831.jpg'
];

const getRandomClothingImage = () => {
  const index = Math.floor(Math.random() * RANDOM_CLOTHING_IMAGES.length);
  return RANDOM_CLOTHING_IMAGES[index];
};

// Styled Components
const ProductContainer = styled.div`
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;

const ProductImageContainer = styled.div`
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
`;

const ProductImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
  opacity: ${({ loaded }) => (loaded ? '1' : '0')};
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductInfo = styled.div`
  padding: 0 0.5rem;

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-weight: bold;
    color: #2a6496;
    margin-bottom: 0;
  }
`;

// Product Component
const Product = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.image || getRandomClothingImage());
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImageLoaded(false);
    setRetryCount(0);
    setImageUrl(product.image || getRandomClothingImage());
  }, [product]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      setImageUrl(getRandomClothingImage());
    }
  };

  return (
    <ProductContainer>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        <ProductImageContainer>
          <ProductImage
            src={imageUrl}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loaded={imageLoaded}
          />
          {!imageLoaded && (
            <ImagePlaceholder>
              <Loader small />
            </ImagePlaceholder>
          )}
        </ProductImageContainer>
        <ProductInfo>
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
        </ProductInfo>
      </Link>
    </ProductContainer>
  );
};

// HomePage Component
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(PRODUCTS_API_URL);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '0 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ margin: '1.5rem 0', fontSize: '2rem' }}>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomePage;
