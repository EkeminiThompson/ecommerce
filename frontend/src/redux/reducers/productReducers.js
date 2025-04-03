import { createSlice } from '@reduxjs/toolkit';

// Product List Slice
export const productListSlice = createSlice({
  name: 'productList',
  initialState: { 
    loading: false,
    error: null,
    products: [] 
  },
  reducers: {
    productListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productListSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.map(product => ({
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        price: 0,
        reviews: [],
        ...product
      }));
    },
    productListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productListReset: (state) => {
      state.loading = false;
      state.error = null;
      state.products = [];
    }
  },
});

// Product Details Slice - Optimized version
export const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState: { 
    loading: false,
    error: null,
    product: null 
  },
  reducers: {
    productDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.product = null;
    },
    productDetailsSuccess: (state, action) => {
      state.loading = false;
      state.product = {
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        price: 0,
        reviews: [],
        ...action.payload
      };
    },
    productDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.product = null;
    },
    productDetailsReset: (state) => {
      state.loading = false;
      state.error = null;
      state.product = null;
    }
  },
});

// Product Create Slice
export const productCreateSlice = createSlice({
  name: 'productCreate',
  initialState: { 
    loading: false,
    error: null,
    success: false,
    product: null 
  },
  reducers: {
    productCreateRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    productCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = {
        countInStock: 0,
        ...action.payload
      };
    },
    productCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    productCreateReset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.product = null;
    }
  },
});

// Export actions
export const {
  productListRequest,
  productListSuccess,
  productListFail,
  productListReset
} = productListSlice.actions;

export const {
  productDetailsRequest,
  productDetailsSuccess,
  productDetailsFail,
  productDetailsReset
} = productDetailsSlice.actions;

export const {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  productCreateReset
} = productCreateSlice.actions;

// Export reducers
export const productListReducer = productListSlice.reducer;
export const productDetailsReducer = productDetailsSlice.reducer;
export const productCreateReducer = productCreateSlice.reducer;