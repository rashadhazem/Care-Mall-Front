import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

const CartPage = () => {
    const { items, totalStruct } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleCheckout = () => {
        Swal.fire({
            title: 'Proceed to Checkout?',
            text: "This is a demo checkout flow.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Place Order'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(clearCart());
                Swal.fire(
                    'Ordered!',
                    'Your order has been placed successfully.',
                    'success'
                );
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full">
                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Your Cart is Empty</h2>
                <p className="text-gray-500 dark:text-gray-400">Looks like you haven't added anything yet.</p>
                <Link
                    to="/products"
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Helmet>
                <title>Shopping Cart | Mall App</title>
            </Helmet>
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart ({items.length} items)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.store}</p>
                                <div className="flex items-center gap-2 text-blue-600 font-bold">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <button
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <button
                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg transition"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg transition"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>

                        <div className="space-y-4 mb-6 border-b dark:border-gray-700 pb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>${totalStruct.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Shipping</span>
                                <span className="text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Tax (Estimate)</span>
                                <span>${(totalStruct.total * 0.1).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold mb-8 dark:text-white">
                            <span>Total</span>
                            <span>${(totalStruct.total * 1.1).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30 group"
                        >
                            Checkout Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-4 text-center">
                            <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
