import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { setLanguage } from '../../store/slices/languageSlice';
import { logout } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import { Moon, Sun, ShoppingCart, Menu, Globe, Heart, Package, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mode } = useSelector((state) => state.theme);
    const { code } = useSelector((state) => state.language);
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleLanguageToggle = () => {
        const newLang = code === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        dispatch(setLanguage(newLang));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsMenuOpen(false);
    };
    const [open, setOpen] = useState(false);
    // Helper to close menu on link click
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <img src="/MallLogo.png" alt="CARE Mall Logo" className="h-16 w-16 " />
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            CARE Mall
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4 space-x-reverse">

                        <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                            {t('products') || 'Products'}
                        </Link>

                        <Link to="/stores" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                            {t('stores') || 'Stores'}
                        </Link>

                        {isAuthenticated && role === 'user' && (
                            <>
                                <Link to="/wishlist" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Wishlist">
                                    <Heart size={20} />
                                </Link>
                                <Link to="/orders" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Orders">
                                    <Package size={20} />
                                </Link>
                            </>
                        )}

                        {(!isAuthenticated || role === 'user') && (
                            <Link to="/cart" className="relative text-gray-700 dark:text-gray-200 hover:text-primary-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Cart">
                                <ShoppingCart size={20} />
                                {items.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {items.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

                        <Button variant="ghost" onClick={handleThemeToggle} title="Toggle Theme">
                            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        <Button variant="ghost" className="flex items-center gap-2" onClick={handleLanguageToggle} title="Switch Language">
                            <Globe size={20} />
                            <span className="text-xs uppercase font-bold">{code}</span>
                        </Button>

                        {isAuthenticated ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setOpen(true)}
                                onMouseLeave={() => setOpen(false)}
                            >
                                {/* Button */}
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <User size={20} />
                                    <span className="hidden lg:inline max-w-[100px] truncate">
                                        {user?.name?.split(" ")?.[0] || "User"}
                                    </span>
                                </Button>

                                {/* Dropdown */}
                                {open && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                        {role === "user" && (
                                            <Link
                                                to="/profile"
                                                onClick={() => setOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <User className="inline mr-2 w-4 h-4" />
                                                {t("myProfile") || "My Profile"}
                                            </Link>
                                        )}

                                        {role === "admin" && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LayoutDashboard className="inline mr-2 w-4 h-4" />
                                                Admin Dashboard
                                            </Link>
                                        )}

                                        {role === "vendor" && (
                                            <Link
                                                to="/vendor"
                                                onClick={() => setOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LayoutDashboard className="inline mr-2 w-4 h-4" />
                                                Vendor Dashboard
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <LogOut className="inline mr-2 w-4 h-4" />
                                            {t("logout")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="primary" size="sm">
                                        {t("login")}
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm">
                                        {t("signup")}
                                    </Button>
                                </Link>
                            </div>
                        )}


                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center gap-2">
                            {(!isAuthenticated || role === 'user') && (
                                <Link to="/cart" className="relative text-gray-700 dark:text-gray-200 p-2">
                                    <ShoppingCart size={24} />
                                    {items.length > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                            {items.length}
                                        </span>
                                    )}
                                </Link>
                            )}
                            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <Menu size={24} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-xl">
                    <Link to="/products" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {t('products') || 'Products'}
                    </Link>
                    <Link to="/stores" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {t('stores') || 'Stores'}
                    </Link>

                    {isAuthenticated && (
                        <>
                            {role === 'user' && (
                                <>
                                    <Link to="/wishlist" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        {t('wishlist') || 'Wishlist'}
                                    </Link>
                                    <Link to="/orders" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        {t('orders') || 'Orders'}
                                    </Link>
                                </>
                            )}
                            {role === 'admin' && (
                                <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Admin Dashboard
                                </Link>
                            )}
                            {role === 'vendor' && (
                                <Link to="/vendor" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Vendor Dashboard
                                </Link>
                            )}
                        </>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="ghost" className="justify-start" onClick={handleLanguageToggle}>
                                <Globe size={18} className="mr-2" />
                                <span>{code === 'en' ? 'Arabic' : 'English'}</span>
                            </Button>
                            <Button variant="ghost" className="justify-start" onClick={handleThemeToggle}>
                                {mode === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                                <span>Theme</span>
                            </Button>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        <Button variant="primary" className="w-full justify-center mt-4 bg-red-600 hover:bg-red-700" onClick={handleLogout}>
                            {t('logout')}
                        </Button>
                    ) : (
                        <div className="flex  justify-center mt-4 gap-2">
                            <Link to="/login" onClick={closeMenu}>
                                <Button variant="primary" className="w-full justify-center mt-4">
                                    {t('login')}
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={closeMenu}>
                                <Button variant="primary" className="w-full justify-center mt-4">
                                    {t('signup')}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav >
    );

};

export default Navbar;
