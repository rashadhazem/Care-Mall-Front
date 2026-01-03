import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Truck, Clock, DollarSign, Package } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { ordersApi } from '../../lib/api';
import Swal from 'sweetalert2';
import Modal from '../../components/ui/Modal';

const VendorOrders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    console.log("selected order",selectedOrder);
    console.log("orders",orders);
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await ordersApi.getOrders();
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            Swal.fire('Error', 'Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (orderId) => {
        try {
            await ordersApi.updateOrderToPaid(orderId);
            Swal.fire('Success', 'Order marked as paid', 'success');
            fetchOrders();
            setIsDetailsOpen(false);
        } catch (error) {
            console.error("Error updating order:", error);
            Swal.fire('Error', 'Failed to update order status', 'error');
        }
    };

    const handleMarkAsDelivered = async (orderId) => {
        try {
            await ordersApi.updateOrderToDelivered(orderId);
            Swal.fire('Success', 'Order marked as delivered', 'success');
            fetchOrders();
            setIsDetailsOpen(false);
        } catch (error) {
            console.error("Error updating order:", error);
            Swal.fire('Error', 'Failed to update order status', 'error');
        }
    };

    const getStatusColor = (isDelivered) => {
        return isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
    };

    const columns = [
        { header: t('order_id'), accessor: 'id', render: (o) => <span className="font-mono text-sm">{o._id}</span> },
        { header: t('customer'), accessor: 'user', render: (o) => o.user?.name || 'Guest' },
        { header: t('date'), accessor: 'createdAt', render: (o) => new Date(o.createdAt).toLocaleDateString() },
        { header: t('total'), accessor: 'totalOrderPrice', render: (o) => `$${o.totalOrderPrice}` },
        {
            header: t('payment'),
            accessor: 'isPaid',
            render: (o) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {o.isPaid ? 'Paid' : 'Unpaid'}
                </span>
            )
        },
        {
            header: t('delivery'),
            accessor: 'isDelivered',
            render: (o) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {o.isDelivered ? 'Delivered' : 'Pending'}
                </span>
            )
        },
    ];

    const actions = (order) => (
        <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            onClick={() => {
                setSelectedOrder(order);
                setIsDetailsOpen(true);
            }}
        >
            <Eye className="w-4 h-4" /> {t('details')}
        </Button>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">{t('order_management')}</h1>
                <Button variant="outline" onClick={fetchOrders} isLoading={loading}>
                    Referesh
                </Button>
            </div>

            <AdminTable
                columns={columns}
                data={orders}
                actions={actions}
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
            />

            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={`Order Details #${selectedOrder?._id}`}
                className="max-w-3xl"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer</h3>
                                <p className="font-medium">{selectedOrder.user?.name}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Shipping Details</h3>
                                <p className="text-sm">{selectedOrder.shippingAddress?.details}</p>
                                <p className="text-sm">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                                <p className="text-sm font-medium mt-1">{selectedOrder.shippingAddress?.phone}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
                            <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Product</th>
                                            <th className="px-4 py-3 font-medium">Color</th>
                                            <th className="px-4 py-3 font-medium text-right">Price</th>
                                            <th className="px-4 py-3 font-medium text-center">Qty</th>
                                            <th className="px-4 py-3 font-medium text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-700">
                                        {selectedOrder.cartItems?.map((item, idx) => (
                                            <tr key={idx} className="bg-white dark:bg-gray-800">
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <img src={item.product?.imageCover.url} alt="" className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                                                    <span className="font-medium truncate max-w-[200px]">{item.product?.title}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{item.color || '-'}</td>
                                                <td className="px-4 py-3 text-right">${item.price}</td>
                                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right font-medium">${(item.price * item.count).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
                                        <tr>
                                            <td colSpan="4" className="px-4 py-3 text-right font-bold">Total Amount:</td>
                                            <td className="px-4 py-3 text-right font-bold text-lg text-primary-600">${selectedOrder.totalOrderPrice}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4 border-t dark:border-gray-700">
                            {!selectedOrder.isPaid && (
                                <Button onClick={() => handleMarkAsPaid(selectedOrder._id)} className="bg-green-600 hover:bg-green-700">
                                    <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
                                </Button>
                            )}
                            {!selectedOrder.isDelivered && (
                                <Button onClick={() => handleMarkAsDelivered(selectedOrder._id)} className="bg-blue-600 hover:bg-blue-700">
                                    <Truck className="w-4 h-4 mr-2" /> Mark as Delivered
                                </Button>
                            )}
                            {selectedOrder.isPaid && selectedOrder.isDelivered && (
                                <div className="ml-auto flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
                                    <CheckCircle className="w-5 h-5" /> Order Completed
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VendorOrders;
