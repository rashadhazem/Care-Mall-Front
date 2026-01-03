import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Contact from './pages/contact';
import About from './pages/about';

// Auth Imports

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import LoginOtp from './pages/auth/LoginOtp';
import ForgotPassword from './pages/auth/ForgotPassword';



// User Pages
import StoresPage from './pages/StoresPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import StoreDetailsPage from './pages/StoreDetailsPage';

// Vendor Imports
import VendorLayout from './components/layout/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorChat from './pages/vendor/VendorChat';
import ChatWindow from './components/chat/ChatWindow';
import NotFoundPage from './pages/NotFoundPage';

// Admin Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStores from './pages/admin/AdminStores';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Layout Component
const Layout = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <Outlet />
            </main>
            <Footer />
            <ChatWindow />
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>

            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="stores" element={<StoresPage />} />
                    <Route path="stores/:id" element={<StoreDetailsPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:id" element={<ProductDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />

                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="wishlist" element={<WishlistPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>

                    {/*auth routes*/}
                    <Route path="/login" element={<div className="p-10 text-center"><Login /></div>} />
                    <Route path="/signup" element={<div className="p-10 text-center"><Signup /></div>} />
                    <Route path="/login-otp" element={<div className="p-10 text-center"><LoginOtp /></div>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<div className="p-10 text-center">Reset Password Page (Coming Soon)</div>} />

                    {/* Catch all */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Vendor Routes */}
                <Route path="/vendor" element={<ProtectedRoute allowedRoles={['vendor']} />}>
                    <Route element={<VendorLayout />}>
                        <Route index element={<VendorDashboard />} />
                        <Route path="dashboard" element={<VendorDashboard />} />
                        <Route path="products" element={<VendorProducts />} />
                        <Route path="orders" element={<VendorOrders />} />
                        <Route path="chat" element={<VendorChat />} />

                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="stores" element={<AdminStores />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />

                    </Route>
                </Route>
            </Routes>
        </ErrorBoundary>
    );
}

export default App;
