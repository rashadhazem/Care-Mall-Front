import React, { useState } from 'react';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const VendorOrders = () => {
    const { t } = useTranslation();

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

    const columns = [
        { header: t('order_id'), accessor: 'id', render: (o) => <span className="font-medium text-gray-900 dark:text-white">{o.id}</span> },
        { header: t('customer'), accessor: 'customer' },
        { header: t('date'), accessor: 'date' },
        { header: t('total'), accessor: 'total', render: (o) => `$${o.total.toFixed(2)}` },
        {
            header: t('status'),
            accessor: 'status',
            render: (o) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>
                    {o.status}
                </span>
            )
        },
    ];

    const actions = (order) => (
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Eye className="w-4 h-4" /> {t('view')}
        </Button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">{t('order_management')}</h1>

            <AdminTable
                columns={columns}
                data={orders}
                actions={actions}
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
            />
        </div>
    );
};

export default VendorOrders;
