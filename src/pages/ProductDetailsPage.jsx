import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { productsApi, wishlistApi, cartApi } from '../lib/api';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productsApi.getProductById(id);
                setProduct(response.data.data || response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        // Optimistic Redux update (optional, but good for instant feedback)
        dispatch(addToCart({ ...product, quantity }));

        try {
            await cartApi.addToCart({ productId: product._id });
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        } catch (error) {
            console.error("Failed to add to cart server-side", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add item to cart. Please try again.',
            });
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddToWishlist = async () => {
        try {
            await wishlistApi.addToWishlist({ productId: product._id });
            Swal.fire({
                icon: 'success',
                title: 'Added to Wishlist!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            Swal.fire({
                icon: 'info', // Could depend on error code (e.g. already exists)
                title: 'Note',
                text: error.response?.data?.message || 'Failed to add to wishlist',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Product not found</h2>
                <Link to="/products" className="mt-4 text-primary-500 hover:underline">Back to products</Link>
            </div>
        );
    }

    return (
        <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
            <Helmet>
                <title>{product.title || product.name} | Mall App</title>
                <meta name="description" content={`Buy ${product.title || product.name} at the best price from ${product.store?.name || product.store}.`} />
            </Helmet>
            <Link to="/products" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6 transition-colors">
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
                            src={product.imageCover_url || product.imageCover || product.image}
                            alt={product.title || product.name}
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
                                <p className="text-sm font-semibold text-primary-500 tracking-wide uppercase">{product.category?.name || 'Category'}</p>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-2">{product.title || product.name}</h1>
                            </div>
                            <button
                                onClick={handleAddToWishlist}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Add to Wishlist"
                            >
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 font-bold text-yellow-700 dark:text-yellow-500">{product.ratingsAverage}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500 dark:text-gray-400">{product.ratingsQuantity || 0} Reviews</span>
                        </div>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                            {product.priceAfterDiscount && (
                                <span className="text-xl text-gray-400 line-through mb-1">${product.priceAfterDiscount}</span>
                            )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {product.description || `Experience premium quality with our ${(product.title || product.name).toLowerCase()}. Designed for comfort and style, this item is perfect for your daily needs.`}
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

                            <Button
                                onClick={handleAddToCart}
                                isLoading={addingToCart}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-lg"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ProductDetailsPage;
