import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Info, AlertTriangle, XCircle, Clock } from 'lucide-react';

const NotificationItem = ({ notification, onRead }) => {
    const { title, message, type, isRead, createdAt } = notification;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div
            className={`flex items-start p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${!isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
            onClick={onRead}
        >
            <div className="flex-shrink-0 mt-1 mr-3">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {message}
                </p>
                <div className="flex items-center mt-1 space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                        {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                </div>
            </div>
            {!isRead && (
                <div className="flex-shrink-0 ml-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default NotificationItem;
