import React, { useState } from 'react';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

const VendorOrders = () => {
    // Mock Orders
    const [orders, setOrders] = useState([
        { id: '#ORD-001', customer: 'John Doe', date: '2023-10-25', total: 120.50, status: 'Pending' },
        { id: '#ORD-002', customer: 'Jane Smith', date: '2023-10-24', total: 85.00, status: 'Completed' },
        { id: '#ORD-003', customer: 'Alice Johnson', date: '2023-10-23', total: 240.00, status: 'Cancelled' },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Order Management</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300 font-semibold">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1 justify-end w-full">
                                            <Eye className="w-4 h-4" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorOrders;
