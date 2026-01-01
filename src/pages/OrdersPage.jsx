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
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) { // delivered, shipping, pending, cancelled
            case 'delivered': return <CheckCircle className="text-green-500" />;
            case 'shipping': return <Truck className="text-blue-500" />;
            case 'pending': return <Clock className="text-orange-500" />;
            default: return <Package className="text-gray-500" />;
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
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('my_orders')}</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('order_placed')}</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('total_amount')}</p>
                                <p className="font-bold text-gray-900 dark:text-white">${order.totalOrderPrice}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('order_number')}</p>
                                <p className="font-mono text-gray-900 dark:text-white">#{order.id}</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600">
                                {getStatusIcon(order.status || 'pending')}
                                <span className="font-medium text-sm capitalize">{getStatusText(order.status || 'pending')}</span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="space-y-4">
                                {order.cartItems?.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <img
                                            src={item.product?.imageCover_url}
                                            alt={item.product?.title || 'Product'}
                                            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                                {item.product?.title || 'Product Name Unavailable'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {t('qty')}: {item.count} × ${item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <Button variant="outline" size="sm">
                                    {t('view_details')}
                                </Button>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
