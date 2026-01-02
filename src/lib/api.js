import axios from 'axios';
import { clearCart } from '../store/slices/cartSlice';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 60000,

});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth API

export const authAPI = {
  register: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/users/getMe'),
  verifyOtp: (otpData) => api.post('/auth/verifyotp', otpData),
  resendOtp: (email) => api.post('/auth/resendotp', { email }),
  forgotPassword: (email) => api.post('/auth/forgotPassword', { email }),
  verifyRestPasswordOtp: (otpData) => api.post('/auth/verifyResetCode', otpData),
  resetPassword: (passwordData) => api.put('/auth/resetPassword', passwordData)
};

export const brandsApi = {
  getBrands: () => api.get('/brands'),
  getBrandById: (id) => api.get(`/brands/${id}`),
  createBrand: (brandData) => api.post('/brands', brandData),
  updateBrand: (id, brandData) => api.put(`/brands/${id}`, brandData),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productData) => api.post('/cart', productData),
  updateCartItem: (itemId, updateData) => api.put(`/cart/${itemId}`, updateData),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (couponCode) => api.put('/cart/applyCoupon', { code: couponCode }),
}

export const CouponsApi = {
  getCoupons: () => api.get('/coupons'),
  createCoupon: (couponData) => api.post('/coupons', couponData),

  getOneCoupon: (id) => api.get(`/coupons/${id}`),
  updateCoupon: (id, couponData) => api.put(`/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
}

export const ordersApi = {
  createOrder: (cartId, orderData) => api.post(`/orders/${cartId}`, orderData),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderToPaid: (id) => api.put(`/orders/${id}/pay`),
  updateOrderToDelivered: (id) => api.put(`/orders/${id}/deliver`),
  checkOutSession: (cartId) => api.get(`/orders/checkout-session/${cartId}`),
}

export const productsApi = {
  // Update to accept params object and convert to query string
  getProducts: (params = {}) => {
    // If params is just a page number (old usage), handle it
    if (typeof params === 'number') {
      return api.get(`/products?page=${params}`);
    }
    // Otherwise treat as query object
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products?${queryString}`);
  },
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
}

export const reviewsApi = {
  getReviews: (productsId) => api.get(`/products/${productsId}/reviews`),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  createReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
}

export const storesApi = {
  getStores: (page = 1) => api.get(`/stores?page=${page}`),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (storeData) => api.post('/stores', storeData),
  updateStore: (id, storeData) => api.put(`/stores/${id}`, storeData),
  deleteStore: (id) => api.delete(`/stores/${id}`),
}

export const subCategoriesApi = {
  getSubCategories: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),
  getSubCategoryById: (id) => api.get(`/subcategories/${id}`),
  createSubCategory: (categoryId, subCategoryData) => api.post(`/categories/${categoryId}/subcategories`, subCategoryData),
  updateSubCategory: (id, subCategoryData) => api.put(`/subcategories/${id}`, subCategoryData),
  deleteSubCategory: (id) => api.delete(`/subcategories/${id}`),
}

export const usersApi = {
  loggedInUser: () => api.get('/users/getMe'),
  changeMyPassword: (passwordData) => api.put('/users/changeMyPassword', passwordData),
  updateMe: (userData) => api.put('/users/updateMe', userData),
  deleteMe: () => api.delete('/users/deleteMe'),
  changePassword: (userId, passwordData) => api.put(`/users/changePassword/${userId}`, passwordData),
  getUsers: (page = 1) => api.get(`/users?page=${page}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productData) => api.post('/wishlist', productData),
  removeFromWishlist: (itemId) => api.delete(`/wishlist/${itemId}`),
}


export const categoriesApi = {
  getCategories: (page = 1) => api.get(`/categories?page=${page}`),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
}






export default api;