import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-md">
                Oops! The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
            >
                <Home className="w-5 h-5" />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
