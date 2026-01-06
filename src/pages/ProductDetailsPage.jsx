import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartThunks';
import { productsApi, wishlistApi, cartApi } from '../lib/api';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, Heart, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';
import ProductReviews from '../components/products/ProductReviews';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    // New State for schema fields
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productsApi.getProductById(id);
                const productData = response.data.data || response.data;
                setProduct(productData);

                // Initialize selected image and color
                if (productData.imageCover.url || productData.imageCover) {
                    setSelectedImage(productData.imageCover.url || productData.imageCover);
                }
                if (productData.colors && productData.colors.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (product.stock === 0 || product.quantity === 0) {
            Swal.fire('Out of Stock', 'This product is currently unavailable.', 'warning');
            return;
        }

        setAddingToCart(true);
        const cartItem = {
            ...product,
            quantity,
            selectedColor
        };
        // Optimistic Redux update
       

        try {
            await dispatch(
                addToCart({
                    productId: product._id,
                    quantity,
                    color: selectedColor
                })
            ).unwrap();
            
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
                text: error.response?.data?.message || 'Failed to add item to cart. Please try again.',
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
                icon: 'info',
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

    const {
        title, description, price, priceAfterDiscount,
        ratingsAverage, ratingsQuantity, category,
        brand, quantity: stock, images, colors
    } = product;

    return (
        <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
            <Helmet>
                <title>{title} | Mall App</title>
                <meta name="description" content={`Buy ${title}.`} />
            </Helmet>
            <Link to="/products" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 flex items-center justify-center min-h-[300px] md:min-h-[400px]"
                        >
                            <img
                                src={selectedImage}
                                alt={title}
                                className="w-full h-full max-h-[500px] object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
                            />
                        </motion.div>

                        {/* Image Gallery */}
                        {images && images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedImage(product.imageCover.url || product.imageCover)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImage === (product.imageCover.url || product.imageCover) ? 'border-primary-500' : 'border-transparent'}`}
                                >
                                    <img src={product.imageCover.url || product.imageCover} alt="Cover" className="w-full h-full object-cover" />
                                </button>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img.url)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImage === img.url ? 'border-primary-500' : 'border-transparent'}`}
                                    >
                                        <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-primary-500 tracking-wide uppercase">{category?.name || 'Category'}</span>
                                {brand && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {brand.name || 'Brand'}
                                        </span>
                                    </>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="ml-1 font-bold text-yellow-700 dark:text-yellow-500">{ratingsAverage || 0}</span>
                                </div>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500 dark:text-gray-400">{ratingsQuantity || 0} Reviews</span>
                                <span className="text-gray-400">|</span>
                                <span className={`flex items-center gap-1 font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stock > 0 ? <Check size={16} /> : <AlertCircle size={16} />}
                                    {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="flex items-end gap-3 mb-6">
                                {priceAfterDiscount && priceAfterDiscount < price ? (
                                    <>
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">${priceAfterDiscount}</span>
                                        <span className="text-xl text-gray-400 line-through mb-1">${price}</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {description}
                        </p>

                        {/* Colors */}
                        {colors && colors.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Select Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedColor === color
                                                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Truck className="w-5 h-5 text-green-500" />
                                <span>Free shipping on orders over $100</span>
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
                                    onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
                                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >+</button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                isLoading={addingToCart}
                                disabled={stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-lg"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <button
                                onClick={handleAddToWishlist}
                                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Add to Wishlist"
                            >
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ProductReviews productId={id} />
        </PageWrapper >
    );
};

export default ProductDetailsPage;

