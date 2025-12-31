import React, { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { categories as initialCategories } from '../../lib/fakeData';

const AdminCategories = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', image: '' });

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, image: category.image });
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

    const handleSave = () => {
        if (!formData.name) return;

        if (editingCategory) {
            // Update
            setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
            Swal.fire('Updated!', 'Category has been updated.', 'success');
        } else {
            // Create
            const newCategory = {
                id: Date.now().toString(),
                ...formData,
                itemCount: 0 // Default
            };
            setCategories(prev => [newCategory, ...prev]);
            Swal.fire('Created!', 'Category has been created.', 'success');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Delete this category?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setCategories(prev => prev.filter(c => c.id !== id));
                Swal.fire('Deleted!', 'Category has been deleted.', 'success');
            }
        });
    };

    const columns = [
        {
            header: 'Image', accessor: 'image', render: (c) => (
                <img src={c.image} alt={c.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
            )
        },
        {
            header: 'Name', accessor: 'name', render: (c) => (
                <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
            )
        },
        {
            header: 'Items', accessor: 'itemCount', render: (c) => (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                    {c.itemCount || 0} items
                </span>
            )
        },
    ];

    const actions = (category) => (
        <>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(category)} title="Edit">
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(category.id)} title="Delete">
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus size={20} />
                        Add Category
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={categories}
                actions={actions}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? "Edit Category" : "Add Category"}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSave}>{editingCategory ? "Save Changes" : "Create Category"}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Category Name"
                        placeholder="e.g. Electronics"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Image URL"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AdminCategories;
