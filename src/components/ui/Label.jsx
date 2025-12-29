import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Label = ({ className, children, ...props }) => {
    return (
        <label
            className={twMerge(clsx(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300",
                className
            ))}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
