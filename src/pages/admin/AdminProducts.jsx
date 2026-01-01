import React, { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { productsApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const AdminProducts = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ title: '', price: '', imageCover: '', category: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await productsApi.getProducts(page);
            setProducts(res.data.data || []);
            setTotalPages(res.data.paginationResult?.numberOfPages || 1);
            setCurrentPage(res.data.paginationResult?.currentPage || page);
        } catch (error) {
            console.error("Error fetching products:", error);
            Swal.fire(t('error'), t('failed_to_fetch_products'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                price: product.price,
                imageCover: product.imageCover || '',
                category: product.category._id || product.category?.name || product.category // Adjust based on your API
            });
        } else {
            setEditingProduct(null);
            setFormData({ title: '', price: '', imageCover: '', category: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ title: '', price: '', imageCover: '', category: '' });
    };

    const handleSave = async () => {
        if (!formData.title) {
            Swal.fire(t('error'), t('title_required'), 'error');
            return;
        }

        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('price', formData.price);
        fd.append('category', formData.category);
        if (formData.imageCover instanceof File) {
            fd.append('imageCover', formData.imageCover);
        }

        try {
            if (editingProduct) {
                await productsApi.updateProduct(editingProduct._id, fd);
                Swal.fire(t('updated'), t('product_updated_success'), 'success');
            } else {
                await productsApi.createProduct(fd);
                Swal.fire(t('created'), t('product_created_success'), 'success');
            }
            handleCloseModal();
            fetchProducts(currentPage);
        } catch (error) {
            console.error("Error saving product:", error);
            Swal.fire(t('error'), t('failed_to_save_product'), 'error');
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
                    await productsApi.deleteProduct(id);
                    setProducts(prev => prev.filter(p => p._id !== id));
                    Swal.fire(t('deleted'), t('product_deleted_success'), 'success');
                } catch (error) {
                    console.error("Error deleting product:", error);
                    Swal.fire(t('error'), t('failed_to_delete_product'), 'error');
                }
            }
        });
    };

    const columns = [
        {
            header: t('product_title'), accessor: 'title', render: (p) => (
                <div className="flex items-center gap-3">
                    <img src={p.imageCover_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.category?.name || p.category}</p>
                    </div>
                </div>
            )
        },
        { header: t('price'), accessor: 'price', render: (p) => `$${p.price}` },
        { header: t('category'), accessor: 'category', render: (p) => p.category?.name || p.category },
    ];

    const actions = (product) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(product)} title={t('edit')}>
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(product._id)} title={t('delete')}>
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('products_management')}</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('search_products_placeholder')}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus size={20} />
                        {t('add_product')}
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={products}
                actions={actions}
                isLoading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? t('edit_product') : t('add_product')}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal}>{t('cancel')}</Button>
                        <Button onClick={handleSave}>{editingProduct ? t('save_changes') : t('create_product')}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label={t('product_name')}
                        placeholder={t('product_name_placeholder')}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <div className="flex gap-4">
                        <Input
                            label={t('price')}
                            type="number"
                            placeholder="0.00"
                            className="flex-1"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <Input
                            label={t('category')}
                            placeholder={t('category_placeholder')}
                            className="flex-1"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <Input
                        label={t('image')}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, imageCover: e.target.files[0] })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AdminProducts;
