import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={twMerge(clsx(
                "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50",
                className
            ))}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => (
    <div
        className={twMerge(clsx("flex flex-col space-y-1.5 p-6", className))}
        {...props}
    >
        {children}
    </div>
);

const CardTitle = ({ className, children, ...props }) => (
    <h3
        className={twMerge(clsx("font-semibold leading-none tracking-tight", className))}
        {...props}
    >
        {children}
    </h3>
);

const CardDescription = ({ className, children, ...props }) => (
    <p
        className={twMerge(clsx("text-sm text-gray-500 dark:text-gray-400", className))}
        {...props}
    >
        {children}
    </p>
);

const CardContent = ({ className, children, ...props }) => (
    <div className={twMerge(clsx("p-6 pt-0", className))} {...props}>
        {children}
    </div>
);

const CardFooter = ({ className, children, ...props }) => (
    <div
        className={twMerge(clsx("flex items-center p-6 pt-0", className))}
        {...props}
    >
        {children}
    </div>
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
