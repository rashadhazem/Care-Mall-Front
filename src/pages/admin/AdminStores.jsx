import React, { useState, useEffect, useMemo } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';
import { Search, Filter, Check, X, Trash2, Plus, Edit } from 'lucide-react';
import Swal from 'sweetalert2';
import { storesApi, usersApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const AdminStores = () => {
    const { t } = useTranslation();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', image: '', owner: '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchStores = async (page = 1) => {
        setLoading(true);
        try {
            const res = await storesApi.getStores(page);
            setStores(res.data.data || []);
            if (res.data.paginationResult) {
                setTotalPages(res.data.paginationResult.numberOfPages || 1);
                setCurrentPage(res.data.paginationResult.currentPage || page);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
            Swal.fire(t('error'), 'Failed to fetch stores', 'error');
        } finally {
            setLoading(false);
        }
    }

    const fetchVendors = async () => {
        try {
            const res = await usersApi.getUsers();
            // Assuming users API also might be paginated, we might need to fetch all vendors logic separately
            // For now specific to this UI requirement
            console.log("users", res.data.data);
            const vendorsOnly = (res.data.data || []).filter(u => u.role === 'vendor');
            setVendors(vendorsOnly);
            console.log("vendor", vendorsOnly);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };


    useEffect(() => {
        fetchStores(currentPage);
        fetchVendors();
    }, [currentPage]);

    const filteredStores = useMemo(() => {
        if (!searchQuery.trim()) return stores;
        const q = searchQuery.toLowerCase();
        return stores.filter(store =>
            store.name?.toLowerCase().includes(q)
        );
    }, [searchQuery, stores]);


    const handleOpenModal = (store = null) => {
        if (store) {
            setEditingStore(store);
            setFormData({
                name: store.name || '',
                description: store.description || '',
                image: store.image?.public_id || '',
                owner: store.owner?._id || store.owner || ''
            });
        } else {
            setEditingStore(null);
            setFormData({
                name: '',
                description: '',
                image: '',
                owner: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
        setFormData({ name: '', description: "", image: "", owner: "" });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.owner) {
            Swal.fire(t('error'), 'Name and Owner are required', 'error');
            return;
        }

        try {
            setSaving(true);
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('owner', formData.owner);
            if (formData.image instanceof File) {
                fd.append('image', formData.image);
            }

            if (editingStore) {
                await fetch("http://localhost:8000/api/v1/stores/" + editingStore._id, {
                    method: 'PUT',
                    body: fd,
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                Swal.fire(t('updated'), t('success'), 'success');
            } else {
                await storesApi.createStore(fd);
                Swal.fire(t('created'), t('success'), 'success');
            }
            await fetchStores(currentPage);
            handleCloseModal();
        } catch (error) {
            console.error("Error saving store:", error);
            Swal.fire(t('error'), 'Failed to save store', 'error');
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
                    await storesApi.deleteStore(id);
                    Swal.fire(t('deleted'), t('success'), 'success');
                    await fetchStores(currentPage);
                } catch (error) {
                    console.error("Error deleting store:", error);
                    Swal.fire(t('error'), 'Failed to delete store', 'error');
                }
            }
        });
    };

    const columns = [
        {
            header: t('modules.stores'),
            accessor: 'name', render: (s) => (
                <div className="flex items-center gap-3">
                    <img src={s.image?.url} alt=""
                        className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.description}</p>
                    </div>
                </div>
            )
        },
        {
            header: t('owner'),
            accessor: 'owner',
            render: (s) => (
                <div>
                    <p className="font-medium">{s.owner?.name}</p>
                    <p className="text-xs text-gray-500">{s.owner?.email}</p>
                </div>
            )
        },

    ];

    const actions = (store) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(store)} title={t('edit')}>
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(store._id)} title={t('delete')}>
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('stores_management')}</h1>
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
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus size={20} />
                        {t('add_store')}
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredStores}
                actions={actions}
                isLoading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingStore ? t('edit_store') : t('add_store')}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal} disabled={saving}>{t('cancel')}</Button>
                        <Button onClick={handleSave} isLoading={saving}>{editingStore ? t('save') : t('add_new')}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label={t('name')}
                        placeholder="e.g. Fashion Hub"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label={t('description')}
                        placeholder="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Input
                        label={t('image')}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setFormData({ ...formData, image: e.target.files[0] })
                        }
                    />
                    <div>
                        <Label className="block mb-1 text-sm font-medium">{t('owner')} ({t('vendor')})</Label>
                        <select
                            className="w-full border rounded px-3 py-2 bg-gray-600"
                            value={formData.owner}
                            onChange={(e) =>
                                setFormData({ ...formData, owner: e.target.value })
                            }
                        >
                            <option value="">Select Vendor</option>
                            {vendors.map(v => (
                                <option key={v._id} value={v._id}>
                                    {v.name} ({v.email})
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default AdminStores;
