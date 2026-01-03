import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import

const About = () => {
  const { t } = useTranslation(); // Init

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('about_title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('about_subtitle')}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-8">
              {/* Icon */}
              <div className="text-9xl">🛍️</div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('our_vision')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
              {t('vision_text')}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {t('founded_text')}
            </p>

            <div className="pt-4">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
              >
                {t('work_with_us')}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{t('stats_brands')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">12M</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{t('stats_visitors')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">24/7</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{t('stats_support')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">100%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">{t('stats_authentic')}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;