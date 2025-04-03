// src/redux/actions/productActions.js
import axios from 'axios';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
} from '../constants/productConstants';

// Configured Axios instance with fallback and default settings
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Enhanced with error normalization and debugging
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    const { data } = await api.get('/api/products');
    
    console.log('Products list response:', data); // Debug log
    
    // Normalize product data
    const normalizedProducts = Array.isArray(data) 
      ? data.map(product => ({
          ...product,
          countInStock: product.countInStock || 0,
          reviews: product.reviews || []
        }))
      : [];
    
    dispatch({ 
      type: PRODUCT_LIST_SUCCESS, 
      payload: normalizedProducts 
    });
    
  } catch (error) {
    console.error('Products list error:', error);
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Failed to fetch products';
    
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: errorMessage
    });
  }
};

// Updated with data normalization and better error handling
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await api.get(`/api/products/${id}`);
    
    console.log('Product details raw response:', data); // Debug log
    
    // Normalize product data
    const normalizedProduct = {
      ...data,
      countInStock: data.countInStock || 0,
      reviews: data.reviews || [],
      rating: data.rating || 0,
      numReviews: data.numReviews || 0
    };
    
    console.log('Normalized product:', normalizedProduct); // Debug log

    dispatch({ 
      type: PRODUCT_DETAILS_SUCCESS, 
      payload: normalizedProduct 
    });
    
  } catch (error) {
    console.error('Product details error:', error);
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Failed to fetch product details';
    
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: errorMessage
    });
  }
};

// Enhanced with data validation and debugging
export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    // Validate product data
    if (!product || typeof product !== 'object') {
      throw new Error('Invalid product data');
    }

    const { userLogin: { userInfo } } = getState();
    
    if (!userInfo?.token) {
      throw new Error('Authentication required');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Prepare product data with defaults
    const productData = {
      name: product.name || '',
      price: Number(product.price) || 0,
      description: product.description || '',
      image: product.image || '',
      brand: product.brand || '',
      category: product.category || '',
      countInStock: Number(product.countInStock) || 0
    };

    console.log('Creating product with data:', productData); // Debug log

    const { data } = await api.post('/api/products', productData, config);
    
    console.log('Product creation response:', data); // Debug log

    // Normalize response data
    const createdProduct = {
      ...data,
      countInStock: data.countInStock || 0,
      reviews: data.reviews || []
    };

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: createdProduct
    });
    
    return createdProduct; // Return created product for potential chaining
    
  } catch (error) {
    console.error('Product creation error:', error);
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Failed to create product';
    
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: errorMessage
    });
    
    throw error; // Re-throw for component-level handling
  }
};