import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../ui/Button';

const SectionHeader = ({ title, linkTo }) => {
    const { t } = useTranslation();
    const { dir } = useSelector((state) => state.language);
    const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
            </h2>
            {linkTo && (
                <Button variant="ghost" size="sm" className="group text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <span>{t('viewAll', 'View All')}</span>
                    <ArrowIcon size={16} className="ml-2 rtl:mr-2 rtl:ml-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Button>
            )}
        </div>
    );
};

export default SectionHeader;
