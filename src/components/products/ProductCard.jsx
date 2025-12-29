import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Button from '../ui/Button';

const ProductCard = ({ product }) => {
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {product.tag && (
                    <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        {product.tag}
                    </div>
                )}

                <button className="absolute top-2 right-2 rtl:left-2 rtl:right-auto p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 duration-300">
                    <Heart size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                        {product.store}
                    </span>
                    <div className="flex items-center text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 rtl:mr-1 rtl:ml-0 font-medium">
                            {product.rating} ({product.reviews})
                        </span>
                    </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${product.price}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>
                    <Button size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                        <ShoppingCart size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
