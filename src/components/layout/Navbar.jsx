import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { setLanguage } from '../../store/slices/languageSlice';
import Button from '../ui/Button';
import { Moon, Sun, ShoppingCart, Menu, Globe } from 'lucide-react';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);
    const { code } = useSelector((state) => state.language);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleLanguageToggle = () => {
        const newLang = code === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        dispatch(setLanguage(newLang));
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            Mall App
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                        {/* Space-x-reverse handles RTL margin flipping automatically if dir=rtl */}

                        <Button variant="ghost" className="flex items-center gap-2" onClick={handleLanguageToggle}>
                            <Globe size={20} />
                            <span>{code === 'en' ? 'Arabic' : 'English'}</span>
                        </Button>

                        <Button variant="ghost" onClick={handleThemeToggle}>
                            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        <Button variant="ghost">
                            <ShoppingCart size={20} />
                        </Button>

                        <Button variant="primary">
                            {t('login')}
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost">
                            <Menu size={24} />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
