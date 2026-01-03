import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import { Link } from 'react-router-dom';
import { storesApi, categoriesApi } from '../lib/api';
import { showToast } from '../lib/toast';
import { Search, Star, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const StoresPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
        fetchStores();
        fetchCategories();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await storesApi.getStores();
            const storesData = response.data.data || response.data || [];
            setStores(storesData);
            setFilteredStores(storesData);
        } catch (error) {
            console.error('Error fetching stores:', error);
            showToast('error', 'Failed to load stores');
            setStores([]);
            setFilteredStores([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoriesApi.getCategories();
            const categoriesData = response.data.data || response.data || [];
            if (categoriesData.length > 0) {
                setCategoriesList(categoriesData);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const filtered = stores.filter(store => {
            const matchesSearch = store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory ?
                (store.category?._id === selectedCategory || store.category?.name === selectedCategory) : true;
            return matchesSearch && matchesCategory;
        });
        setFilteredStores(filtered);
    }, [searchTerm, selectedCategory, stores]);

    return (
        <PageWrapper className="p-6 max-w-7xl mx-auto space-y-8">
            <Helmet>
                <title>Stores | Mall App</title>
                <meta name="description" content="Browse our wide selection of stores." />
            </Helmet>

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Stores</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Find your favorite shops and brands.</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stores..."
                            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categoriesList.map(c => (
                            <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading stores...</p>
                </div>
            )}

            {/* Stores Grid */}
            {!loading && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    {filteredStores.map(store => (
                        <motion.div
                            key={store._id || store.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to={`/stores/${store._id || store.id}`}
                                className="block h-full group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={store.image.url || store.logo || '/placeholder-store.jpg'}
                                        alt={store.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = '/placeholder-store.jpg'; }}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-sm text-yellow-600">
                                        <Star className="h-4 w-4 fill-yellow-500" />
                                        {store.rating || store.ratingsAverage || '4.5'}
                                    </div>
                                </div>

                                <div className="p-5 flex items-start gap-4">
                                    <img
                                        src={store.logo || store.image.url || '/placeholder-logo.jpg'}
                                        alt={`${store.name} logo`}
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md -mt-10 bg-white"
                                        onError={(e) => { e.target.src = '/placeholder-logo.jpg'; }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {store.name}
                                        </h3>
                                        <p className="text-sm text-blue-500 font-medium mb-1">{store.category?.name || 'General'}</p>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            <span>{store.location || 'Cairo, Egypt'}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {!loading && filteredStores.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No stores found matching your search.</p>
                </div>
            )}
        </PageWrapper>
    );
};

export default StoresPage;
