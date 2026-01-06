import React, { useState, useEffect } from 'react';
import { wishlistApi, cartApi } from '../lib/api';
import { Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addToCart, fetchCart } from '../store/slices/cartThunks';

const WishlistPage = () => {
    const { t } = useTranslation();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await wishlistApi.getWishlist();
            // Assuming API returns { data: [ { _id, product: {...} } ] } or { data: [ product... ] }
            // Adjust based on your actual API response structure for wishlist
            // Commonly wishlist contains product details
            setWishlist(res.data.data || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            // Swal.fire(t('error'), 'Failed to load wishlist', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemoveFromWishlist = async (id) => {
        try {
            await wishlistApi.removeFromWishlist(id); // Pass product ID
            setWishlist(prev => prev.filter(item => item._id !== id && item.product?._id !== id));
            Swal.fire({
                title: t('removed'),
                text: t('item_removed_wishlist'),
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            fetchWishlist();
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            Swal.fire(t('error'), 'Failed to remove item', 'error');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
            // Refresh cart state after successful add
            dispatch(fetchCart());
            Swal.fire({
                title: t('success'),
                text: t('added_to_cart'),
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            Swal.fire(t('error'), 'Failed to add to cart', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">{t('wishlist_empty')}</h2>
                <p className="text-gray-500 mb-8">{t('wishlist_empty_msg')}</p>
                <Link to="/products">
                    <Button>{t('browse_products')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('my_wishlist')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => {
                    // Verify structure: item might be the product itself or an object containing the product
                    const product = item // item.product || item; 
                    return (
                        <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                            <Link to={`/products/${product._id}`}>
                                <div className="h-48 overflow-hidden bg-gray-100 relative">
                                    <img
                                        src={product.imageCover.url}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/products/${product._id}`}>
                                    <h3 className="font-semibold text-lg mb-1 truncate text-gray-900 dark:text-white hover:text-primary-600">{product.title}</h3>
                                </Link>
                                <p className="text-primary-600 font-bold mb-4">${product.price}</p>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 flex items-center justify-center gap-2"
                                        size="sm"
                                    >
                                        <ShoppingCart size={16} />
                                        {t('add_to_cart')}
                                    </Button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                                        title={t('remove')}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WishlistPage;
