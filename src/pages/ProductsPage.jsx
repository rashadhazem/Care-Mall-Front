import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import { categories } from '../lib/fakeData';
import { productsApi, categoriesApi } from '../lib/api';
import { showToast } from '../lib/toast';
import ProductCard from '../components/products/ProductCard';
import { Helmet } from 'react-helmet-async';

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriesList, setCategoriesList] = useState(categories);

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsApi.getProducts();
            const productsData = response.data.data || response.data || [];
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('error', 'Failed to load products');
            // Fallback to empty array on error
            setProducts([]);
            setFilteredProducts([]);
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
            // Keep using fake data as fallback
        }
    };

    const handleSearch = () => {
        let filtered = products;

        if (selectedCategory) {
            filtered = filtered.filter(
                p => p.category?._id === selectedCategory || p.category?.name === selectedCategory
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(
                p =>
                    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (minPrice) {
            filtered = filtered.filter(p => p.price >= Number(minPrice));
        }

        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= Number(maxPrice));
        }

        setFilteredProducts(filtered);
    };

    // Auto-search when filters change
    useEffect(() => {
        if (products.length > 0) {
            handleSearch();
        }
    }, [searchTerm, selectedCategory, minPrice, maxPrice, products]);

    return (
        <PageWrapper className="p-6 space-y-6">
            <Helmet>
                <title>Products | Mall App</title>
                <meta name="description" content="Find the best products at the best prices." />
            </Helmet>

            {/* Top Filters: Search + Category */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categoriesList.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Price Filter */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">Price Range:</span>
                <input
                    type="number"
                    placeholder="Min Price"
                    className="w-28 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    className="w-28 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                            <motion.div
                                key={p._id || p.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <ProductCard product={p} />
                            </motion.div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-10">No products found</p>
                    )}
                </motion.div>
            )}
        </PageWrapper>
    );
};

export default ProductsPage;
