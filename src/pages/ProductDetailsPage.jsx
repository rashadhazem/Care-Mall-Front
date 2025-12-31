import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { products, stores } from '../lib/fakeData';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const product = products.find(p => p.id === Number(id));
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Product not found</h2>
                <Link to="/products" className="mt-4 text-blue-500 hover:underline">Back to products</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart!',
            text: `${product.name} has been added to your cart.`,
            showConfirmButton: false,
            timer: 1500,
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });
    };

    return (
        <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
            <Helmet>
                <title>{product.name} | Mall App</title>
                <meta name="description" content={`Buy ${product.name} at the best price from ${product.store}.`} />
            </Helmet>
            <Link to="/products" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-6 md:p-8 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full max-w-md object-contain rounded-2xl hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                        />
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="p-8 flex flex-col justify-center"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-blue-500 tracking-wide uppercase">{product.store}</p>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-2">{product.name}</h1>
                            </div>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 font-bold text-yellow-700 dark:text-yellow-500">{product.rating}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500 dark:text-gray-400">{product.reviews} Reviews</span>
                        </div>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-400 line-through mb-1">${product.originalPrice}</span>
                            )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Experience premium quality with our {product.name.toLowerCase()}.
                            Designed for comfort and style, this item is perfect for your daily needs.
                            Available now at {product.store}.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Truck className="w-5 h-5 text-green-500" />
                                <span>Free shipping on orders over $50</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                <span>2 year warranty included</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-auto">
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >-</button>
                                <span className="px-4 font-bold min-w-[3rem] text-center dark:text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ProductDetailsPage;
