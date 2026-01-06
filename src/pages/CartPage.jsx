import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart, updateCart, clearCart } from '../store/slices/cartThunks';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';
import { cartApi, ordersApi } from '../lib/api';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CartPage = () => {
    const { items, total,totalQuantity,status } = useSelector((state) => state.cart);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const {cartId} = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    console.log("items is ",items);

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        details: '',
        phone: '',
        city: '',
        postalCode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
    const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await dispatch(
        updateCart({ itemId, quantity: newQuantity })
      ).unwrap();
    } catch (err) {
      Swal.fire("Error", err, "error");
    }
  };
    // Sync cart from API on mount
    useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchCart());
  }
}, [isAuthenticated]);

  

   const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
    } catch (err) {
      Swal.fire("Error", err, "error");
    }
  };

    const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (err) {
      Swal.fire("Error", err, "error");
    }
  };

    const handlePlaceOrder = async () => {
        if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
            Swal.fire('Error', 'Please fill in all required shipping fields', 'error');
            return;
        }

        setLoading(true);
        try {
            let currentCartId = cartId;
            if (!currentCartId) {
                const res = await cartApi.getCart();
                // Ensure we get the ID correctly from the response structure
                currentCartId = res.data.data?._id || res.data._id || res.data.cartId;
            }

            if (!currentCartId) {
                throw new Error("No active cart found");
            }

            if (paymentMethod === 'cash') {
                await ordersApi.createOrder(currentCartId, { shippingAddress });

                dispatch(clearCart());
                setIsCheckoutOpen(false);
                Swal.fire({
                    title: 'Order Placed!',
                    text: 'Your order has been successfully placed.',
                    icon: 'success',
                    confirmButtonText: 'View Orders'
                }).then(() => {
                    navigate('/orders');
                });
            } else {
                // Online Payment
                const res = await ordersApi.checkOutSession(currentCartId);
                // Assuming res.data.session.url or similar contains the Stripe/Gateway URL
                // Verify the exact path in api.js or backend docs. 
                // Usually it's in data.session.url or just data.url
                const checkoutUrl = res.data.session?.url || res.data.url;
                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                } else {
                    throw new Error("Invalid checkout session URL");
                }
            }

        } catch (error) {
            console.error("Order placement failed", error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to place order', 'error');
        } finally {
            setLoading(false);
        }
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
            <div className='flex justify-between items-center mb-8'>
                <h1 className="text-3xl font-bold dark:text-white">Shopping Cart ({items.length} items)</h1>
                <Button variant="ghost" onClick={handleClearCart} className="text-red-500 hover:bg-red-50">
                    <Trash2 size={18} className="mr-2" /> Clear Cart
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item, index) => {
                        const cartItemId = item._id || item.id || (item.product && (item.product._id || item.product)) || index;
                        return (
                          <div key={cartItemId} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                                <img src={item.product.imageCover?.url} alt={item.product.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.product.title}</h3>
                                {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.store}</p> */}
                                <div className="flex items-center gap-2 text-blue-600 font-bold">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <button
                                    onClick={() => handleRemoveItem(cartItemId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(cartItemId, Math.max(1, item.quantity - 1))}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg transition"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(cartItemId, item.quantity + 1)}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg transition"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>

                        <div className="space-y-4 mb-6 border-b dark:border-gray-700 pb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>${(total || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Shipping</span>
                                <span className="text-green-500">Free</span>
                            </div>
                            {/* <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Tax (Estimate)</span>
                                <span>${((total || 0) * 0.1).toFixed(2)}</span>
                            </div> */}
                        </div>

                        <div className="flex justify-between text-xl font-bold mb-8 dark:text-white">
                            <span>Total</span>
                            <span>${(total || 0).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30 group"
                        >
                            Proceed to Checkout
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

            {/* Checkout Modal */}
            <Modal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                title="Shipping Details"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
                        <Button onClick={handlePlaceOrder} isLoading={loading}>
                            {paymentMethod === 'cash' ? 'Place Order' : 'Proceed to Pay'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                        Please enter your shipping details and select a payment method.
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-2 mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                    className="hidden"
                                />
                                <div className="text-center font-medium">Cash on Delivery</div>
                            </label>
                            <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                    className="hidden"
                                />
                                <div className="text-center font-medium">Online Payment</div>
                            </label>
                        </div>
                    </div>
                    <Input
                        label="Delivery Address Details"
                        placeholder="Street, Building, Apartment"
                        value={shippingAddress.details}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, details: e.target.value })}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="+1 234 567 890"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                    <div className="flex gap-4">
                        <Input
                            label="City"
                            placeholder="City"
                            className="flex-1"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        />
                        <Input
                            label="Postal Code"
                            placeholder="ZIP Code"
                            className="flex-1"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CartPage;
