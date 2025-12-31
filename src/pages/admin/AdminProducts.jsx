import React, { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { products as initialProducts } from '../../lib/fakeData';

const AdminProducts = () => {
    const [products, setProducts] = useState(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', image: '', category: '' });

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ name: product.name, price: product.price, image: product.image, category: product.category });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', image: '', category: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', image: '', category: '' });
    };

    const handleSave = () => {
        if (!formData.name) return;

        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
            Swal.fire('Updated!', 'Product has been updated.', 'success');
        } else {
            const newProduct = {
                id: Date.now().toString(),
                ...formData,
                rating: 0,
                discount: 0
            };
            setProducts(prev => [newProduct, ...prev]);
            Swal.fire('Created!', 'Product has been created.', 'success');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Delete this product?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setProducts(prev => prev.filter(p => p.id !== id));
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            }
        });
    };

    const columns = [
        {
            header: 'Product', accessor: 'name', render: (p) => (
                <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                    </div>
                </div>
            )
        },
        { header: 'Price', accessor: 'price', render: (p) => `$${p.price}` },
        { header: 'Category', accessor: 'category', render: (p) => p.category },
    ];

    const actions = (product) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(product)} title="Edit">
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(product.id)} title="Delete">
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus size={20} />
                        Add Product
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={products}
                actions={actions}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? "Edit Product" : "Add Product"}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSave}>{editingProduct ? "Save Changes" : "Create Product"}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Product Name"
                        placeholder="e.g. Wireless Mouse"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div className="flex gap-4">
                        <Input
                            label="Price"
                            type="number"
                            placeholder="0.00"
                            className="flex-1"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <Input
                            label="Category"
                            placeholder="Electronics"
                            className="flex-1"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Image URL"
                        placeholder="https://example.com/product.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AdminProducts;
