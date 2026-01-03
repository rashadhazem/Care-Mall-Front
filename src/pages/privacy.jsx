import React from 'react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
    const { t } = useTranslation();

    // يمكنك استبدال النصوص بـ t('privacy.title') إذا كنت ستضيفها في ملفات الترجمة
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            1. Introduction
                        </h2>
                        <p>
                            Welcome to our platform. Your privacy is critically important to us. This Privacy Policy 
                            explains how we collect, use, and protect your personal information when you use our 
                            services, including our website and any related applications.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            2. Information We Collect
                        </h2>
                        <p className="mb-4">
                            We collect information to provide better services to all our users. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Data:</strong> Name, email address, and contact details.</li>
                            <li><strong>Usage Data:</strong> Pages visited, time spent on the site, and device information.</li>
                            <li><strong>Cookies:</strong> To enhance your experience and remember your preferences.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            3. How We Use Your Information
                        </h2>
                        <p>
                            The information we collect is used to personalize your experience, improve our website 
                            functionality, process transactions, and send periodic emails regarding your orders or 
                            other products and services.
                        </p>
                    </section>

                    <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            4. Data Security
                        </h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal 
                            information. However, no method of transmission over the Internet is 100% secure. 
                            We strive to use commercially acceptable means to protect your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            5. Third-Party Disclosure
                        </h2>
                        <p>
                            We do not sell, trade, or otherwise transfer to outside parties your personally 
                            identifiable information unless we provide users with advance notice, except for 
                            website hosting partners and other parties who assist us in operating our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            6. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, you can contact us via:
                        </p>
                        <div className="mt-4 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400">
                            Email: support@yourmall.com <br />
                            Address: 123 Shopping St, Commerce City
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;