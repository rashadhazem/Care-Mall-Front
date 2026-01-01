import React, { useState, useEffect, useMemo } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { categoriesApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const AdminCategories = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', image: '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCategories = async (page = 1) => {
        setLoading(true);
        try {
            const res = await categoriesApi.getCategories(page);
            setCategories(res.data.data || []);
            // Only update total pages if backend actually supports pagination for categories
            // If not supported, it might return all data
            if (res.data.paginationResult) {
                setTotalPages(res.data.paginationResult.numberOfPages || 1);
                setCurrentPage(res.data.paginationResult.currentPage || page);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            Swal.fire(t('error'), 'Failed to fetch categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const filterCategories = useMemo(() => {
        if (searchQuery === '') {
            return categories;
        } else {
            return categories.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
    }, [categories, searchQuery]);


    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, image: category.image?.public_id || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', image: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', image: '' });
    };

    const handleSave = async () => {
        if (!formData.name) return;
        const fd = new FormData();
        fd.append('name', formData.name);
        if (formData.image instanceof File) {
            fd.append('image', formData.image);
        }
        try {
            if (editingCategory) {
                const res = await categoriesApi.updateCategory(editingCategory._id, fd);
                if (res.status === 200 || res.status === 201) {
                    Swal.fire(t('updated'), t('success'), 'success');
                }
            } else {
                await categoriesApi.createCategory(fd);
                Swal.fire(t('created'), t('success'), 'success');
            }
            handleCloseModal();
            fetchCategories(currentPage);
        } catch (error) {
            console.error("Error saving category:", error);
            Swal.fire(t('error'), 'Failed to save category', 'error');
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
                    await categoriesApi.deleteCategory(id);
                    setCategories(prev => prev.filter(c => c._id !== id));
                    Swal.fire(t('deleted'), t('success'), 'success');
                } catch (error) {
                    console.error("Error deleting category:", error);
                    Swal.fire(t('error'), 'Failed to delete category', 'error');
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

    ];

    const actions = (category) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(category)} title={t('edit')}>
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(category._id)} title={t('delete')}>
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categories_management')}</h1>
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
                        {t('add_category')}
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filterCategories}
                actions={actions}
                isLoading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? t('edit_category') : t('add_category')}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal}>{t('cancel')}</Button>
                        <Button onClick={handleSave}>{editingCategory ? t('save') : t('add_new')}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label={t('name')}
                        placeholder="e.g. Electronics"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label={t('image')}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AdminCategories;
