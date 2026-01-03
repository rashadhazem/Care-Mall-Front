import React, { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';
import { Search, Ban, Eye, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { usersApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const AdminUsers = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    // include all fields backend accepts: slug, phone, image, role, active, isVerified
    const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '', slug: '', phone: '', image: '', active: true, isVerified: false });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await usersApi.getUsers(page);
            setUsers(res.data.data || []);
            setTotalPages(res.data.paginationResult?.numberOfPages || 1);
            setCurrentPage(res.data.paginationResult?.currentPage || page);
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire(t('error'), 'Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Client-side filtering for users (since API might not support keyword search on this endpoint yet)
    const filteredUsers = React.useMemo(() => {
        if (!searchQuery.trim()) return users;
        const q = searchQuery.toLowerCase();
        return users.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                password: '',
                slug: user.slug || '',
                phone: user.phone || '',
                image: user.image?.url || user.image || '',
                active: user.active !== undefined ? user.active : true,
                isVerified: user.isVerified || false
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: '', password: '', slug: '', phone: '', image: '', active: true, isVerified: false });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: '', password: '' });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            Swal.fire(t('error'), 'Name and Email are required', 'error');
            return;
        }

        try {
            setSaving(true);
            const payload = { // only include fields allowed by backend
                name: formData.name,
                slug: formData.slug || undefined,
                phone: formData.phone || undefined,
                email: formData.email,
                image: formData.image || undefined,
                role: formData.role,
                active: formData.active,
                isVerified: formData.isVerified
            };

            if (formData.password) payload.password = formData.password;

            if (editingUser) {
                await usersApi.updateUser(editingUser._id, payload);
                Swal.fire(t('updated'), t('success'), 'success');
            } else {
                await usersApi.createUser(payload);
                Swal.fire(t('created'), t('success'), 'success');
            }
            handleCloseModal();
            fetchUsers(currentPage);
        } catch (error) {
            console.error("Error saving user:", error);
            const msg = error.response?.data?.message || 'Failed to save user';
            Swal.fire(t('error'), msg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: t('confirm_delete'),
            text: t('confirm_delete_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('yes_delete'),
            cancelButtonText: t('cancel')
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await usersApi.deleteUser(id);
                    setUsers(prev => prev.filter(u => u._id !== id));
                    Swal.fire(t('deleted'), t('success'), 'success');
                } catch (error) {
                    console.error("Error deleting user:", error);
                    Swal.fire(t('error'), 'Failed to delete user', 'error');
                }
            }
        });
    };

    const toggleStatus = async (id, currentActive,email) => {
        try {
            const newActive = !currentActive;
            await usersApi.updateUser(id, { active: newActive ,email:email});
            setUsers(prev => prev.map(u => u._id === id ? { ...u, active: newActive } : u));
            Swal.fire(t('success'), `User ${newActive ? 'activated' : 'deactivated'}`, 'success');
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire(t('error'), 'Failed to update status', 'error');
        }
    };

    const columns = [
        {
            header: t('name'), accessor: 'name', render: (u) => (
                <div className="flex items-center gap-3">
                    {u.image || u.image?.url ? (
                        <img src={u.image?.url || u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                            {u.name ? u.name[0]?.toUpperCase() : '?'}
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: t('role'), accessor: 'role', render: (u) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'vendor' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {u.role}
                </span>
            )
        },
        {
            header: t('status'), accessor: 'status', render: (u) => {
                const isActive = u.active === undefined ? u.status === 'active' : u.active;
                return (
                    <span className={`flex items-center gap-1 text-sm ${isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {isActive ? <CheckCircle size={14} /> : <Ban size={14} />}
                        {isActive ? 'active' : 'banned'}
                    </span>
                );
            }
        },
        { header: t('joined'), accessor: 'createdAt', render: (u) => new Date(u.createdAt).toLocaleDateString() },
    ];

    const actions = (user) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(user)} title={t('edit')}>
                <Edit size={18} />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={(user.active === undefined ? user.status === 'active' : user.active) ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                onClick={() => toggleStatus(user._id, (user.active === undefined ? user.status === 'active' : user.active),user.email)}
                title={(user.active === undefined ? user.status === 'active' : user.active) ? "Block" : "Unblock"}
            >
                {(user.active === undefined ? user.status === 'active' : user.active) ? <Ban size={18} /> : <CheckCircle size={18} />}
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user._id)} title={t('delete')}>
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('users_management')}</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredUsers}
                actions={actions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? t('edit_user') : t('add_user')}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal} disabled={saving}>{t('cancel')}</Button>
                        <Button onClick={handleSave} isLoading={saving}>{editingUser ? t('save') : t('add_new')}</Button>
                    </>
                }
            >
                        <div className="space-y-4">
                        <Input
                            label={t('name')}
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label={t('email')}
                            type="email"
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label={t('password')}
                            type="password"
                            placeholder={editingUser ? "Leave blank to keep current" : t('password')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <div>
                            <Label className="block mb-1 text-sm font-medium">{t('role')}</Label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">{t('user')}</option>
                                <option value="vendor">{t('vendor')}</option>
                                <option value="admin">{t('admin')}</option>
                            </select>
                        </div>

                        <Input
                            label="Phone"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <Input
                            label="Slug"
                            placeholder="user-slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />

                        <Input
                            label="Image URL"
                            placeholder="https://..."
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />

                        <div className="flex gap-4 items-center">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={!!formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="accent-primary-600" />
                                <span className="text-sm">Active</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={!!formData.isVerified} onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })} className="accent-primary-600" />
                                <span className="text-sm">Verified</span>
                            </label>
                        </div>
                    </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;
