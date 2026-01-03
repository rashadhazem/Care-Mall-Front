import React, { useState, useEffect, useMemo } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { brandsApi, storesApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const AdminBrands = () => {
    const { t } = useTranslation();
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({ name: '', image: '', store: '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchInitialData = async () => {
        try {
            const storesRes = await storesApi.getStores(); // Fetch all stores? Pagination might be an issue if too many.
            setStores(storesRes.data.data || []);
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
    };

    const fetchBrands = async (page = 1) => {
        setLoading(true);
        try {
            // Check if brandsApi supports pagination logic or returns all
            const res = await brandsApi.getBrands();
            // The currently defined brandsApi.getBrands() seems to just get all brands (based on reading api.js earlier)
            // But let's assume it might return a list.
            setBrands(res.data.data || []);
            // If API doesn't support pagination, we might do client-side pagination or just ignore pagination props
            setTotalPages(1);
        } catch (error) {
            console.error("Error fetching brands:", error);
            Swal.fire(t('error'), 'Failed to fetch brands', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
        fetchBrands(currentPage);
    }, [currentPage]);

    const filterBrands = useMemo(() => {
        if (searchQuery === '') {
            return brands;
        } else {
            return brands.filter((brand) => brand.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
    }, [brands, searchQuery]);


    const handleOpenModal = (brand = null) => {
        if (brand) {
            setEditingBrand(brand);
            setFormData({
                name: brand.name,
                image: brand.image?.public_id || '',
                store: brand.store?._id || brand.store || '' // Assuming brand has store
            });
        } else {
            setEditingBrand(null);
            setFormData({ name: '', image: '', store: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBrand(null);
        setFormData({ name: '', image: '', store: '' });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.store) {
            Swal.fire(t('error'), 'Name and Store are required', 'warning');
            return;
        }

        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('store', formData.store);

        if (formData.image instanceof File) {
            fd.append('image', formData.image);
        }

        try {
            setSaving(true);
            if (editingBrand) {
                await brandsApi.updateBrand(editingBrand._id, fd);
                Swal.fire(t('updated'), t('success'), 'success');
            } else {
                await brandsApi.createBrand(fd);
                Swal.fire(t('created'), t('success'), 'success');
            }
            handleCloseModal();
            fetchBrands(currentPage);
        } catch (error) {
            console.error("Error saving brand:", error);
            Swal.fire(t('error'), 'Failed to save brand', 'error');
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
                    await brandsApi.deleteBrand(id);
                    setBrands(prev => prev.filter(c => c._id !== id));
                    Swal.fire(t('deleted'), t('success'), 'success');
                } catch (error) {
                    console.error("Error deleting brand:", error);
                    Swal.fire(t('error'), 'Failed to delete brand', 'error');
                }
            }
        });
    };

    const columns = [
        {
            header: t('image'), accessor: 'image', render: (c) => (
                <img src={c.image?.url} alt={c.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
            )
        },
        {
            header: t('name'), accessor: 'name', render: (c) => (
                <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
            )
        },
        {
            header: 'Store', accessor: 'store', render: (c) => (
                <span>{c.store?.name || c.store || '-'}</span>
            )
        }
    ];

    const actions = (brand) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(brand)} title={t('edit')}>
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(brand._id)} title={t('delete')}>
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands Management</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus size={20} />
                        Add Brand
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filterBrands}
                actions={actions}
                isLoading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingBrand ? 'Edit Brand' : 'Add Brand'}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal} disabled={saving}>{t('cancel')}</Button>
                        <Button onClick={handleSave} isLoading={saving}>{editingBrand ? t('save') : t('add_new')}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Brand Name"
                        placeholder="e.g. Nike"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Select
                        label="Store"
                        value={formData.store}
                        onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    >
                        <option value="">Select Store</option>
                        {stores.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </Select>

                    <Input
                        label="Brand Image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AdminBrands;
