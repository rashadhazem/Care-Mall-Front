import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mall App</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We are redefining the shopping experience by bringing the world's most luxurious brands under one digital roof.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-8">
              {/* صورة تعبيرية أو أيقونة كبيرة */}
              <div className="text-9xl">🛍️</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
              "To create a seamless bridge between premium craftsmanship and modern technology, ensuring that luxury is just a click away."
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Founded in 2025, Mall App has quickly become the leading platform for fashion enthusiasts who seek quality, authenticity, and style.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/contact" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
              >
                Work with us
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Brands</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">12M</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Visitors</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">24/7</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Support</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">100%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Authentic</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;