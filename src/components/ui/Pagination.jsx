import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
    const { dir } = useSelector((state) => state.language);
    const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
    const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={twMerge(clsx("flex items-center justify-center space-x-2 space-x-reverse", className))}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 p-0"
            >
                <PrevIcon size={16} />
            </Button>

            {pages.map((page) => {
                // Simple logic to show limited pages could be added here, currently showing all
                if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                    return (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            className="w-9 h-9 p-0"
                        >
                            {page}
                        </Button>
                    );
                } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                ) {
                    return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
            })}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 p-0"
            >
                <NextIcon size={16} />
            </Button>
        </div>
    );
};

export default Pagination;
