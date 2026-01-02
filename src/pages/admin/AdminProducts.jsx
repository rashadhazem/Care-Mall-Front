import React, { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { Search, Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { productsApi, brandsApi, categoriesApi, subCategoriesApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const AdminProducts = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        priceAfterDiscount: '',
        quantity: '',
        category: '',
        subcategories: [], // Selected subcategories IDs
        brand: '',
        imageCover: '',
        images: [],
        colors: '', // Comma separated string for UI
    });

    // Data for Selects
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [availableSubCategories, setAvailableSubCategories] = useState([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts(currentPage);
        fetchInitialData();
    }, [currentPage]);

    const fetchInitialData = async () => {
        try {
            const [catsRes, brandsRes] = await Promise.all([
                categoriesApi.getCategories(1), // Assuming 1 gets enough or implement search later
                brandsApi.getBrands()
            ]);
            setCategories(catsRes.data.data || []);
            setBrands(brandsRes.data.data || []);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await productsApi.getProducts({ page });
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

    const fetchSubCategories = async (categoryId) => {
        if (!categoryId) {
            setAvailableSubCategories([]);
            return;
        }
        try {
            const res = await subCategoriesApi.getSubCategories(categoryId);
            setAvailableSubCategories(res.data.data || []);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setFormData(prev => ({ ...prev, category: catId, subcategories: [] }));
        fetchSubCategories(catId);
    };

    const handleOpenModal = async (product = null) => {
        if (product) {
            // If editing, we need to fetch subcategories for the product's category immediately
            const catId = product.category?._id || product.category;
            if (catId) await fetchSubCategories(catId);

            setEditingProduct(product);
            setFormData({
                title: product.title,
                description: product.description || '',
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount || '',
                quantity: product.quantity || '',
                category: catId,
                subcategories: product.subcategories ? product.subcategories.map(s => s._id || s) : [],
                brand: product.brand?._id || product.brand || '',
                imageCover: '', // Keep empty unless changed
                images: [],
                colors: product.colors ? product.colors.join(', ') : '',
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: '', description: '', price: '', priceAfterDiscount: '', quantity: '',
                category: '', subcategories: [], brand: '', imageCover: '', images: [], colors: ''
            });
            setAvailableSubCategories([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleCreateSubCategory = async () => {
        if (!formData.category) {
            Swal.fire(t('error'), 'Please select a category first', 'warning');
            return;
        }

        const { value: subCategoryName } = await Swal.fire({
            title: 'Create New SubCategory',
            input: 'text',
            inputLabel: 'SubCategory Name',
            inputPlaceholder: 'Enter subcategory name',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!'
                }
            }
        });

        if (subCategoryName) {
            try {
                const res = await subCategoriesApi.createSubCategory(formData.category, { name: subCategoryName });
                const newSub = res.data.data;
                setAvailableSubCategories(prev => [...prev, newSub]);
                // Automatically select the new subcategory? Maybe not, just add to list
                Swal.fire('Created!', 'SubCategory has been created.', 'success');
            } catch (error) {
                console.error("Error creating subcategory:", error);
                Swal.fire('Error', 'Failed to create subcategory', 'error');
            }
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.title || !formData.price || !formData.category || !formData.quantity || !formData.description) {
            Swal.fire(t('error'), 'Please fill in all required fields (Title, Description, Price, Quantity, Category)', 'error');
            return;
        }

        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('price', formData.price);
        fd.append('quantity', formData.quantity);
        fd.append('category', formData.category);

        if (formData.priceAfterDiscount) fd.append('priceAfterDiscount', formData.priceAfterDiscount);
        if (formData.brand) fd.append('brand', formData.brand);

        // Colors: split by comma and trim
        if (formData.colors) {
            const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(c => c);
            colorsArray.forEach((color, index) => {
                fd.append(`colors[${index}]`, color);
            });
        }

        // Subcategories
        if (formData.subcategories && formData.subcategories.length > 0) {
            formData.subcategories.forEach((sub, index) => {
                // Assuming backend expects array of IDs
                fd.append(`subcategories[${index}]`, sub);
            });
        }

        // Images
        if (formData.imageCover instanceof File) {
            fd.append('imageCover', formData.imageCover);
        }

        if (formData.images && formData.images.length > 0) {
            Array.from(formData.images).forEach(file => {
                fd.append('images', file);
            });
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
            // Show detailed error if available
            const msg = error.response?.data?.message || t('failed_to_save_product');
            Swal.fire(t('error'), msg, 'error');
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
                    <img src={p.imageCover.url } alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white" title={p.description}>{p.title}</p>
                        <p className="text-xs text-gray-500">{p.category?.name || p.category}</p>
                    </div>
                </div>
            )
        },
        { header: t('price'), accessor: 'price', render: (p) => `$${p.price}` },
        { header: 'Qty', accessor: 'quantity' },
        { header: 'Brand', accessor: 'brand', render: (p) => p.brand?.name || p.brand || '-' },
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

            {isModalOpen && (
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
                    className="max-w-4xl" // Wider modal for more fields
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <Input
                                label={t('product_name')}
                                placeholder={t('product_name_placeholder')}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <Textarea
                                label="Description"
                                placeholder="Product details..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    label="Price After Discount"
                                    type="number"
                                    placeholder="Optional"
                                    className="flex-1"
                                    value={formData.priceAfterDiscount}
                                    onChange={(e) => setFormData({ ...formData, priceAfterDiscount: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <Input
                                    label="Quantity"
                                    type="number"
                                    placeholder="0"
                                    className="flex-1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Select
                                label={t('category')}
                                value={formData.category}
                                onChange={handleCategoryChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </Select>

                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Select
                                        label="Subcategory"
                                        value={formData.subcategories[0] || ''} // Handle single selection mostly, or improve for multiple
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // For now, let's treat it as single select or append? Schema suggests array.
                                            // Let's implement single select for now to avoid UI complexity, but store as array
                                            setFormData({ ...formData, subcategories: val ? [val] : [] })
                                        }}
                                        disabled={!availableSubCategories.length}
                                    >
                                        <option value="">Select Subcategory</option>
                                        {availableSubCategories.map(s => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-3"
                                    title="Create New Subcategory"
                                    onClick={handleCreateSubCategory}
                                    disabled={!formData.category}
                                >
                                    <Plus size={18} />
                                </Button>
                            </div>

                            <Select
                                label="Brand"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            >
                                <option value="">Select Brand</option>
                                {brands.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </Select>

                            <Input
                                label="Colors (comma separated)"
                                placeholder="Red, Blue, Green"
                                value={formData.colors}
                                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, imageCover: e.target.files[0] })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Images (Album)</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setFormData({ ...formData, images: e.target.files })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdminProducts;

