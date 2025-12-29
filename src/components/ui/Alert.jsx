import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
};

const styles = {
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
};

const Alert = ({ variant = 'info', title, children, className, ...props }) => {
    const Icon = icons[variant];

    return (
        <div
            role="alert"
            className={twMerge(clsx(
                "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current rtl:[&>svg~*]:pl-0 rtl:[&>svg~*]:pr-7 rtl:[&>svg]:left-auto rtl:[&>svg]:right-4",
                styles[variant],
                className
            ))}
            {...props}
        >
            <Icon className="h-4 w-4" />
            <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>
            <div className="text-sm opacity-90">{children}</div>
        </div>
    );
};

export default Alert;
