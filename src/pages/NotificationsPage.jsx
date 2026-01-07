import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllAsRead, markAsRead } from '../store/slices/notificationSlice';
import NotificationItem from '../components/common/NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { items, unreadCount, loading } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        <Bell className="w-8 h-8 text-primary-600" />
                        {t('notifications') || 'Notifications'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('manage_notifications_desc') || 'View and manage your alerts and messages'}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        onClick={() => dispatch(markAllAsRead())}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <CheckCheck size={18} />
                        {t('mark_all_read') || 'Mark all as read'}
                    </Button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading && items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : items.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {items.map((item) => (
                            <div key={item._id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <NotificationItem
                                    notification={item}
                                    onRead={() => dispatch(markAsRead(item._id))}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No notifications</h3>
                        <p className="max-w-sm mt-2 text-gray-400">
                            You're all caught up! New notifications will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
