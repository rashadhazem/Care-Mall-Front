import React, { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { Search, Ban, Eye, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

// Mock Users Data
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'vendor', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'banned', joined: '2024-03-10' },
];

const AdminUsers = () => {
    const [users, setUsers] = useState(mockUsers);

    const toggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        const action = newStatus === 'banned' ? 'Block' : 'Unblock';

        Swal.fire({
            title: `${action} User?`,
            text: `Are you sure you want to ${action.toLowerCase()} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'banned' ? '#d33' : '#10B981',
            confirmButtonText: `Yes, ${action.toLowerCase()}!`
        }).then((result) => {
            if (result.isConfirmed) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
                Swal.fire(`${action}ed!`, `User has been ${action.toLowerCase()}ed.`, 'success');
            }
        });
    };

    const columns = [
        {
            header: 'User', accessor: 'name', render: (u) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                        {u.name[0]}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Role', accessor: 'role', render: (u) => (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 uppercase">
                    {u.role}
                </span>
            )
        },
        {
            header: 'Status', accessor: 'status', render: (u) => (
                <span className={`flex items-center gap-1 text-sm ${u.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                    {u.status === 'active' ? <CheckCircle size={14} /> : <Ban size={14} />}
                    {u.status}
                </span>
            )
        },
        { header: 'Joined', accessor: 'joined' },
    ];

    const actions = (user) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="View Details">
                <Eye size={18} />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={user.status === 'active' ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                onClick={() => toggleStatus(user.id, user.status)}
                title={user.status === 'active' ? "Block" : "Unblock"}
            >
                {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={users}
                actions={actions}
            />
        </div>
    );
};

export default AdminUsers;
