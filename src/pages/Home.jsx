import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { categoriesApi, storesApi, productsApi, brandsApi } from '../lib/api';
import CategoryCard from '../components/categories/CategoryCard';
import SectionHeader from '../components/common/SectionHeader';
import StoreCard from '../components/stores/StoreCard';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';

const Home = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, storesRes, productsRes, brandsRes] = await Promise.all([
                    categoriesApi.getCategories(),
                    storesApi.getStores(),
                    productsApi.getProducts(),
                    brandsApi.getBrands()
                ]);
                setCategories(categoriesRes.data.data || []);
                setStores(storesRes.data.data || []);
                setProducts(productsRes.data.data || []);
                setBrands(brandsRes.data.data || []);
            } catch (error) {
                console.error("Error fetching home data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center bg-gray-900 dark:bg-black shadow-2xl">
                <div className="absolute inset-0 opacity-40">
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        src="blog-post-4.jpg"
                        alt="Hero Mall"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
                    >
                        {t("welcome")}
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Ultimate Shopping
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed"
                    >
                        {t("info")}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                            {t("Shop Now")}
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8 text-white border-white/30 bg-white/5 hover:bg-white/20 backdrop-blur-sm transition-all border-2">
                            {t("View Stores")}
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <SectionHeader title={t("Shop by Category")} />
                <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </section>

            {/* Featured Stores Section */}
            <section>
                <SectionHeader title={t("Featured Stores")} linkTo="/stores" />
                {/* Horizontal Scroll Container with Snap */}
                <div className="relative group">
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4 -mx-4">
                        {stores.map((store) => (
                            <motion.div
                                key={store.id}
                                className="snap-start shrink-0 w-[280px] md:w-[320px]"
                                whileHover={{ y: -5 }}
                            >
                                <StoreCard store={store} />
                            </motion.div>
                        ))}
                    </div>
                    {/* Fade gradients for scroll indication */}
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none md:block hidden md:opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </section>

            {/* Trending Products Section */}
            <section>
                <SectionHeader title={t("Trending Products")} linkTo="/products" />
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Brands Section */}
            <section className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-8">
                <h2 className="text-center text-xl font-bold text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest">
                    {t("Premium Brands")}
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-opacity">
                    {brands.map((brand) => (
                        <img
                            key={brand.id}
                            src={brand.logo}
                            alt={brand.name}
                            className="h-8 md:h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300 dark:invert"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
