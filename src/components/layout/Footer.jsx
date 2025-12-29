import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            Mall App
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Your premium shopping destination.
                        </p>
                    </div>
                    <div className="flex space-x-6 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">About</a>
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy</a>
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms</a>
                        <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</a>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    &copy; {currentYear} Mall App. {t('rights')}.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
