import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAllAsRead, markAsRead } from '../../store/slices/notificationSlice';
import NotificationItem from './NotificationItem';
import { useLocation } from 'react-router-dom';

const NotificationDropdown = () => {
    const dispatch = useDispatch();
    const { items, unreadCount, loading } = useSelector((state) => state.notifications);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
    }, [dispatch, isAuthenticated, location.pathname]); // Re-fetch on route change if needed or just initial

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full transition-colors"
            >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading && items.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : items.length > 0 ? (
                            items.map((item) => (
                                <NotificationItem
                                    key={item._id}
                                    notification={item}
                                    onRead={() => handleRead(item._id)}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <Bell className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                    {/* Optional View All Link */}
                    {/* <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center">
                        <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-500 block">
                            View all
                        </Link>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
