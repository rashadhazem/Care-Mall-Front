import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const Spinner = ({ className, size = 'default', ...props }) => {
    const sizes = {
        sm: 'w-4 h-4',
        default: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    return (
        <Loader2
            className={twMerge(clsx("animate-spin text-primary-600 dark:text-primary-400", sizes[size], className))}
            {...props}
        />
    );
};

export default Spinner;
