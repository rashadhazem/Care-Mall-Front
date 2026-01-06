import React, { useState, useEffect } from 'react';
import { ordersApi } from '../lib/api';
import { Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const OrdersPage = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await ordersApi.getOrders();
                setOrders(res.data.data || []);
                console.log("orders",res.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        // switch (status) { // delivered, shipping, pending, cancelled
        //     case 'delivered': return <CheckCircle className="text-green-500" />;
        //     case 'shipping': return <Truck className="text-blue-500" />;
        //     case 'pending': return <Clock className="text-orange-500" />;
        //     default: return <Package className="text-gray-500" />;
        // }
        if(status === true)
        {
            return <CheckCircle className="text-green-500" />;
        }
        else if(status === false)
        {
            return <Clock className="text-orange-500" />;
        }
        else{
            return <Package className="text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        // Map backend status to user friendly text if needed, or translate
        return t(status) || status;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('my_orders')}</h1>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto border border-dashed border-gray-300 dark:border-gray-700">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">{t('no_orders_yet')}</h2>
                    <p className="text-gray-500 mb-6">{t('no_orders_msg')}</p>
                    <Link to="/products">
                        <Button>{t('start_shopping')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('my_orders')}
        </h1>

        <div className="space-y-6">
            {orders.map((order) => (
                <div
                    key={order._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    {/* ===== Order Header ===== */}
                    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-6 justify-between">
                        <div>
                            <p className="text-xs text-gray-500">{t('order_number')}</p>
                            <p className="font-mono text-sm text-gray-900 dark:text-white">
                                #{order._id}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">{t('order_placed')}</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${order.isDelivered
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                                    }`}
                            >
                                {order.isDelivered ? t('delivered') : t('pending')}
                            </span>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${order.isPaid
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                    }`}
                            >
                                {order.isPaid ? t('paid') : t('not_paid')}
                            </span>
                        </div>
                    </div>

                    {/* ===== Order Body ===== */}
                    <div className="p-4 sm:p-6 space-y-6">
                        {/* Products */}
                        <div className="space-y-4">
                            {order.cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <img
                                        src={item.product?.imageCover?.url}
                                        alt={item.product?.title}
                                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {item.product?.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {t('qty')}: {item.quantity} × ${item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ===== Shipping Address ===== */}
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {t('shipping_address')}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {order.shippingAddress?.details}, {order.shippingAddress?.city}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('phone')}: {order.shippingAddress?.phone}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('postal_code')}: {order.shippingAddress?.postalCode}
                            </p>
                        </div>

                        {/* ===== Payment & Prices ===== */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('payment_info')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('method')}: {order.paymentMethodType}
                                </p>
                                {order.deliveredAt && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {t('delivered_at')}:{" "}
                                        {new Date(order.deliveredAt).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{t('tax')}</span>
                                    <span>${order.taxPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>{t('shipping')}</span>
                                    <span>${order.shippingPrice}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>{t('total')}</span>
                                    <span>${order.totalOrderPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

};

export default OrdersPage;
