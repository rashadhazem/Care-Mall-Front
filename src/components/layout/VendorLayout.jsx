import React, { useState } from 'react';
import { Outlet, Link, useLocation ,NavLink} from 'react-router-dom';
import { LayoutDashboard, Sun,Moon,LogOut,Package, ShoppingBag, MessageSquare, Menu, X ,User} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const VendorLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const {mode} = useSelector(state => state.theme);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }
    
   
    const location = useLocation();

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Vendor Portal</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/vendor/dashboard" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.includes('dashboard') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/vendor/products" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.includes('products') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'}`}>
                        <Package size={20} />
                        My Products
                    </Link>
                    <Link to="/vendor/orders" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.includes('orders') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'}`}>
                        <ShoppingBag size={20} />
                        Orders
                    </Link>
                    <Link to="/vendor/chat" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.includes('chat') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'}`}>
                        <MessageSquare size={20} />
                        Customer Chats
                    </Link>
                </nav>
                
               
                 <div className=" mt-20 p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center px-4 justify-between shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Menu size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="font-semibold text-gray-800 dark:text-white">Vendor Portal</span>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default VendorLayout;
