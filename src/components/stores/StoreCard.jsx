import React from 'react';
import { Star } from 'lucide-react';

const StoreCard = ({ store }) => {
    return (
        <div className="flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div className="p-4 relative">
                <div className="absolute -top-10 left-4 rtl:right-4 rtl:left-auto">
                    <div className="w-16 h-16 rounded-xl border-4 border-white dark:border-gray-800 overflow-hidden bg-white shadow-md">
                        <img
                            src={store.logo}
                            alt={store.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                            {store.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {store.category}
                        </span>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-amber-500 mr-1 rtl:ml-1 rtl:mr-0" fill="currentColor" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{store.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreCard;
