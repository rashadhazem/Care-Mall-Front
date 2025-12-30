import React from 'react';
import { useTranslation } from 'react-i18next';
import { categories, stores, products, brands } from '../lib/fakeData';
import CategoryCard from '../components/categories/CategoryCard';
import SectionHeader from '../components/common/SectionHeader';
import StoreCard from '../components/stores/StoreCard';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center bg-gray-900 dark:bg-black">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="blog-post-4.jpg"
                        alt="Hero Mall"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                       {t("welcome")}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                            Ultimate Shopping
                        </span> <br />
                        {/* Experience */}
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 max-w-lg">
                       {t("info")}             
                                   </p>
                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="rounded-full px-8">
                        {t("Shop Now")}
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8 text-white border-white hover:bg-white/10 dark:text-white dark:border-white dark:hover:bg-white/10">
                        {t("View Stores")}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <SectionHeader title={t("Shop by Category")}/>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </section>

            {/* Featured Stores Section */}
            <section>
                <SectionHeader title={t("Featured Stores")} linkTo="/stores" />
                {/* Horizontal Scroll Container */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                    {stores.map((store) => (
                        // Duplicate for scrolling effect demo
                        <StoreCard key={`dup-${store.id}`} store={store} />
                    ))}
                </div>
            </section>

            {/* Trending Products Section */}
            <section>
                <SectionHeader title={t("Trending Products")} linkTo="/products" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
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
