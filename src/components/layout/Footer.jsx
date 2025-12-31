import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                           CARE Mall 
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t("info2")}
                        </p>
                    </div>
                    <div className="flex space-x-6 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                        <Link href="about" className="hover:text-primary-600 dark:hover:text-primary-400">{t("About")}</Link>
                        <Link href="privacy" className="hover:text-primary-600 dark:hover:text-primary-400">{t("Privacy")}</Link>
                        <Link href="terms" className="hover:text-primary-600 dark:hover:text-primary-400">{t("Terms")}</Link>
                        <Link href="contact" className="hover:text-primary-600 dark:hover:text-primary-400">{t("Contact")}</Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    &copy; {currentYear}CARE Mall . {t('rights')}.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
