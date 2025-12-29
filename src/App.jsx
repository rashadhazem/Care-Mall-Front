import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; // Import Footer
import Home from './pages/Home';

// Layout Component
const Layout = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="stores" element={<div className="p-10 text-center">Stores Page (Coming Soon)</div>} />
                <Route path="products" element={<div className="p-10 text-center">Products Page (Coming Soon)</div>} />
                {/* Catch all */}
                <Route path="*" element={<div className="p-20 text-center text-red-500">404 - Page Not Found</div>} />
            </Route>
        </Routes>
    );
}

export default App;
