import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import { productsApi, categoriesApi, brandsApi } from '../lib/api';
import { showToast } from '../lib/toast';
import ProductCard from '../components/products/ProductCard';
import { Helmet } from 'react-helmet-async';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';
import Button from '../components/ui/Button';

const ProductsPage = () => {
    // State for filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // single category for now
    const [selectedBrand, setSelectedBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("-createdAt"); // Default sort newer first

    // Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    // Fetch master data (categories, brands) on mount
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [catRes, brandRes] = await Promise.allSettled([
                    categoriesApi.getCategories(),
                    brandsApi.getBrands()
                ]);

                if (catRes.status === 'fulfilled') {
                    setCategories(catRes.value.data.data || []);
                }
                if (brandRes.status === 'fulfilled') {
                    setBrands(brandRes.value.data.data || []);
                }

            } catch (error) {
                console.error("Error loading master data", error);
            }
        };
        fetchMasterData();
    }, []);

    // Fetch Products when filters or page change
    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory, selectedBrand, sort, minPrice, maxPrice, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                sort,
            };

            if (searchTerm) params.keyword = searchTerm;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedBrand) params.brand = selectedBrand;
            if (minPrice) params['price[gte]'] = minPrice;
            if (maxPrice) params['price[lte]'] = maxPrice;

            const response = await productsApi.getProducts(params);

            setProducts(response.data.data || []);
            if (response.data.paginationResult) {
                setTotalPages(response.data.paginationResult.numberOfPages || 1);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('error', 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedBrand("");
        setMinPrice("");
        setMaxPrice("");
        setSort("-createdAt");
        setCurrentPage(1);
    };

    return (
        <PageWrapper className="pt-6 pb-12">
            <Helmet>
                <title>Shop Products | Care Mall</title>
                <meta name="description" content="Browse our extensive collection of products." />
            </Helmet>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                    <Button variant="outline" onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2">
                        <Filter size={18} /> Filters
                    </Button>
                    <span className="text-sm text-gray-500">{products.length} Products found</span>
                </div>

                {/* Sidebar Filters */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 lg:w-64 lg:shadow-none lg:bg-transparent
                    ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="h-full overflow-y-auto p-6 lg:p-0">
                        <div className="flex justify-between items-center lg:hidden mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Search */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Search size={18} /> Search
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Search keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold mb-3">Categories</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === ""}
                                            onChange={() => setSelectedCategory("")}
                                            className="accent-primary-600"
                                        />
                                        <span className="text-sm">All Categories</span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat._id}
                                                onChange={() => setSelectedCategory(cat._id)}
                                                className="accent-primary-600"
                                            />
                                            <span className="text-sm">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brands */}
                            {brands.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Brands</h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={selectedBrand === ""}
                                                onChange={() => setSelectedBrand("")}
                                                className="accent-primary-600"
                                            />
                                            <span className="text-sm">All Brands</span>
                                        </label>
                                        {brands.map(brand => (
                                            <label key={brand._id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="brand"
                                                    checked={selectedBrand === brand._id}
                                                    onChange={() => setSelectedBrand(brand._id)}
                                                    className="accent-primary-600"
                                                />
                                                <span className="text-sm">{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price Range */}
                            <div>
                                <h3 className="font-semibold mb-3">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-20 px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-20 px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                <Button variant="outline" className="w-full" onClick={handleClearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Backdrop */}
                {mobileFiltersOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header: Sort & Results Count (Desktop) */}
                    <div className="hidden lg:flex justify-between items-center mb-6">
                        <p className="text-gray-500">Showing {products.length} results</p>
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-gray-500" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="-sold">Best Selling</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-80 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map(p => (
                                        <ProductCard key={p._id} product={p} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="text-gray-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                                    <Button onClick={handleClearFilters}>Clear all filters</Button>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex justify-center gap-2">
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${currentPage === idx + 1
                                                    ? 'bg-primary-600 text-white font-bold'
                                                    : 'bg-white dark:bg-gray-800 border hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </PageWrapper>
    );
};

export default ProductsPage;
