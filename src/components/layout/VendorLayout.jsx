import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Sun,
    Moon,
    LogOut,
    Package,
    ShoppingBag,
    MessageSquare,
    Menu,
    X,
    UserCog,
    Bell,
    Tag
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import Button from '../ui/Button';
import { socketService } from '../../lib/socketService';
import NotificationManager from '../common/NotificationManager';

const VendorLayout = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { mode } = useSelector(state => state.theme);
    const { user } = useSelector(state => state.auth);
    const { unreadCount } = useSelector(state => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    // Ensure socket connection for vendor
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && user) {
            socketService.connect(null, token);
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { path: '/vendor/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
        { path: '/vendor/products', label: t('my_products'), icon: <Package size={20} /> },
        { path: '/vendor/orders', label: t('orders'), icon: <ShoppingBag size={20} /> },
        { path: '/vendor/coupons', label: 'Coupons', icon: <Tag size={20} /> },
        { path: '/vendor/chat', label: t('customer_chats'), icon: <MessageSquare size={20} /> },
        { path: '/vendor/profile', label: t('myProfile'), icon: <UserCog size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <NotificationManager />
            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {t('vendor_portal')}
                        </span>
                        <button onClick={toggleSidebar} className="lg:hidden">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 py-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                    ${isActive || location.pathname.includes(item.path)
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Notifications Link */}
                        <NavLink
                            to="/vendor/notifications"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <Bell size={20} />
                                <span>{t('notifications') || 'Notifications'}</span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </NavLink>
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                                {user?.name?.[0] || 'V'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'Vendor'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                className="flex-1 justify-center"
                                onClick={() => dispatch(toggleTheme())}
                            >
                                {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex-1 justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <button onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <span className="font-bold">{t('vendor_portal')}</span>
                    <div className="w-6" /> {/* Spacer */}
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default VendorLayout;
