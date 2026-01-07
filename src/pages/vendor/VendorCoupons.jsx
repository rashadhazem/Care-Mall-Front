import React, { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Search, Trash2, Plus, Tag } from 'lucide-react';
import Swal from 'sweetalert2';
import { CouponsApi, productsApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const VendorCoupons = () => {
    const { t } = useTranslation();
    const [coupons, setCoupons] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        discount: '',
        expire: '',
        product: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCoupons();
        fetchProducts(); // For the dropdown
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await CouponsApi.getCoupons();
            // Backend might wrap in pagination result or just data
            // Assuming res.data.data is the list based on other services
            setCoupons(res.data.data || []);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            Swal.fire('Error', 'Failed to fetch coupons', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            // Fetch products for the dropdown. 
            // In a real app with many products, this should be a search-as-you-type.
            // For now, fetching a decent number.
            const res = await productsApi.getProducts({ limit: 100 });
            setProducts(res.data.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleOpenModal = () => {
        setFormData({
            name: '',
            discount: '',
            expire: '',
            product: '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.discount || !formData.expire) {
            Swal.fire('Error', 'Name, Discount and Expiry date are required', 'error');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                name: formData.name,
                discount: Number(formData.discount),
                expire: formData.expire,
                product: formData.product || undefined, // Send undefined if empty string
            };

            await CouponsApi.createCoupon(payload);
            Swal.fire('Success', 'Coupon created successfully', 'success');
            handleCloseModal();
            fetchCoupons();
        } catch (error) {
            console.error("Error creating coupon:", error);
            const msg = error.response?.data?.message || 'Failed to create coupon';
            Swal.fire('Error', msg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await CouponsApi.deleteCoupon(id);
                    setCoupons(prev => prev.filter(c => c._id !== id));
                    Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete coupon', 'error');
                }
            }
        });
    };

    const columns = [
        { header: 'Code', accessor: 'name', render: (c) => <span className="font-mono font-bold">{c.name}</span> },
        { header: 'Discount', accessor: 'discount', render: (c) => `${c.discount}%` },
        {
            header: 'Product',
            accessor: 'product',
            render: (c) => c.product ? (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {/* Assuming population, otherwise ID */}
                    {c.product.title || 'Specific Product'}
                </span>
            ) : (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    Global / Store-wide
                </span>
            )
        },
        {
            header: 'Expires',
            accessor: 'expire',
            render: (c) => new Date(c.expire).toLocaleDateString()
        },
    ];

    const actions = (coupon) => (
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(coupon._id)}>
            <Trash2 size={18} />
        </Button>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupon Management</h1>
                <Button onClick={handleOpenModal} className="flex items-center gap-2">
                    <Plus size={20} />
                    Create Coupon
                </Button>
            </div>

            <AdminTable
                columns={columns}
                data={coupons}
                actions={actions}
                isLoading={loading}
                // Pagination props if needed, simpler for now
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
            />

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Create New Coupon"
                    footer={
                        <>
                            <Button variant="ghost" onClick={handleCloseModal} disabled={saving}>Cancel</Button>
                            <Button onClick={handleSave} isLoading={saving}>Create Coupon</Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Input
                            label="Coupon Code"
                            placeholder="e.g. SAVE20"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                        />
                        <div className="flex gap-4">
                            <Input
                                type="number"
                                label="Discount (%)"
                                placeholder="20"
                                className="flex-1"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            />
                            <Input
                                type="date"
                                label="Expiration Date"
                                className="flex-1"
                                value={formData.expire}
                                onChange={(e) => setFormData({ ...formData, expire: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Specific Product (Optional)
                            </label>
                            <Select
                                value={formData.product}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            >
                                <option value="">Select a product (Optional)</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>{p.title}</option>
                                ))}
                            </Select>
                            <p className="text-xs text-gray-500">
                                Leave empty to apply to all products in your store.
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default VendorCoupons;
