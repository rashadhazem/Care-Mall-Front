import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutDashboard,
    Store,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Tags,
    Package,
    UserCog,
    Bell
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import Button from '../ui/Button';
import NotificationManager from '../common/NotificationManager';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mode } = useSelector(state => state.theme);
    const { user } = useSelector(state => state.auth);
    const { unreadCount } = useSelector(state => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/stores', label: 'Stores', icon: <Store size={20} /> },
        { path: '/admin/products', label: 'Products', icon: <ShoppingBag size={20} /> },
        { path: '/admin/categories', label: 'Categories', icon: <Tags size={20} /> },
        { path: '/admin/brands', label: 'Brands', icon: <Tags size={20} /> },
        { path: '/admin/orders', label: 'Orders', icon: <Package size={20} /> },
        { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
        { path: '/admin/profile', label: 'Profile', icon: <UserCog size={20} /> },
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
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            Admin Panel
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
                                    ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Notifications Link */}
                        <NavLink
                            to="/admin/notifications"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                ${isActive
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <Bell size={20} />
                                <span>Notifications</span>
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
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                {user?.name?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@caremall.com'}</p>
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
                    <span className="font-bold">CARE Mall Admin</span>
                    <div className="w-6" /> {/* Spacer */}
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
