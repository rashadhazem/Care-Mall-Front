import React from 'react';

const CategoryCard = ({ category }) => {
    return (
        <div className="flex flex-col items-center gap-3 group cursor-pointer">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary-500 transition-all p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        src={category.image.url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
            </div>
            <span className="font-medium text-sm md:text-base text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {category.name}
            </span>
        </div>
    );
};

export default CategoryCard;
