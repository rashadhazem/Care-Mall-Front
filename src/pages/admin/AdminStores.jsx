import React, { useState ,useEffect} from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Search, Filter, Check, X, Trash2, Plus, Edit } from 'lucide-react';
import Swal from 'sweetalert2';
import { stores as initialStores } from '../../lib/fakeData';

const AdminStores = () => {
    const [stores, setStores] = useState(initialStores.map(s => ({ ...s, status: 'active' })));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const [vendors,setVendors]=useState([]);
    const [formData, setFormData] = useState({
                        name: '',
                        description: '',
                        image: '',
                        owner: ''
                        });


    useEffect(()=>{
        const  fetchVendors=async()=>{
            const res=await fetch("http://localhost:8000/api/v1/users")
            const data =await res.json();
             const vendorsOnly = data.users.filter(u => u.role === 'vendor');
            setVendors(vendorsOnly);
        };
        fetchVendors();
    },[])


    const handleOpenModal = (store = null) => {
        if (store) {
            setEditingStore(store);
            setFormData({ name: store.name,
                   description: store.description,
                    image: store.image,
                    owner: store.owner?._id
                   });
        } else {
            setEditingStore(null);
            setFormData({ name: '',
                        description: '',
                        image: '',
                        owner: ''});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
        setFormData({ name: '', description:"",image:"",owner:"" });
    };

    const handleSave = () => {
        if (!formData.name || !formData.owner) return;
         const selectedVendor=vendors.find(v=>v._id === formData.owner);
         const storeData={
            ...formData,
            owner:selectedVendor
         }
        if (editingStore) {
            setStores(prev => prev.map(s=> s.id === editingStore.id ? { ...s, ...formData } : s));
            Swal.fire('Updated!', 'Store has been updated.', 'success');
        } else {
            const newStore = {
                ...formData,
                isActive:true // New stores are pending by default
            };
            setStores(prev => [newStore, ...prev]);
            Swal.fire('Created!', 'Store has been created.', 'success');
        }
        handleCloseModal();
    };


    const handleApprove = (id) => {
        Swal.fire({
            title: 'Approve Store?',
            text: "This store will be publicly visible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, approve it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setStores(prev => prev.map(s => s.id === id ? { ...s, status: 'active' } : s));
                Swal.fire('Approved!', 'The store has been approved.', 'success');
            }
        });
    };

    const handleReject = (id) => {
        Swal.fire({
            title: 'Reject Store?',
            text: "The store application will be rejected.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, reject it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setStores(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
                Swal.fire('Rejected!', 'The store has been rejected.', 'success');
            }
        });
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
        }).then((result) => {
            if (result.isConfirmed) {
                setStores(prev => prev.filter(s => s.id !== id));
                Swal.fire('Deleted!', 'Store has been deleted.', 'success');
            }
        });
    };

    const columns = [
        {
            header: 'Store Name', 
            accessor: 'name', render: (s) => (
                <div className="flex items-center gap-3">
                    <img src={s.image} alt="" 
                    className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.description}</p>
                    </div>
                </div>
            )
        },
                    {
                header: 'Owner',
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
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenModal(store)} title="Edit">
                <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(store.id)} title="Approve">
                <Check size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" onClick={() => handleReject(store.id)} title="Reject">
                <X size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(store.id)} title="Delete">
                <Trash2 size={18} />
            </Button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stores Management</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search stores..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                        <Plus size={20} />
                        Add Store
                    </Button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={stores}
                actions={actions}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingStore ? "Edit Store" : "Add Store"}
                footer={
                    <>
                        <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={handleSave}>{editingStore ? "Save Changes" : "Create Store"}</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Store Name"
                        placeholder="e.g. Fashion Hub"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Description"
                        placeholder="description"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Input
                        label="Store Image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setFormData({ ...formData, image: e.target.files[0] })
                        }
                        />
                   <div>
                <label className="block mb-1 text-sm font-medium">Owner (Vendor)</label>
                <select
                    className="w-full border rounded px-3 py-2"
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
