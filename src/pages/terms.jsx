import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button'; // استيراد الزر لاستخدامه في الأسفل إذا لزم الأمر

const Terms = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-8 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                        {t('terms_title')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        {t('terms_subtitle')}
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">1</span>
                            {t('terms_1_title')}
                        </h2>
                        <p>
                            {t('terms_1_text')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">2</span>
                            {t('terms_2_title')}
                        </h2>
                        <p>
                            {t('terms_2_text')}
                        </p>
                    </section>

                    <section className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-400 mb-4">
                            3. {t('terms_3_title')}
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-amber-800 dark:text-amber-300/80">
                            <li>{t('terms_3_text')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">4</span>
                            {t('terms_4_title')}
                        </h2>
                        <p>
                            {t('terms_4_text')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">5</span>
                            {t('terms_5_title')}
                        </h2>
                        <p>
                            {t('terms_5_text')}
                        </p>
                    </section>

                    <section className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="mb-6 italic">
                            {t('terms_questions')}
                        </p>
                        <Button variant="primary" className="rounded-full px-10">
                            {t('contact_support')}
                        </Button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;