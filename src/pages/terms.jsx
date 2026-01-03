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
                        Terms & Conditions
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                        Please read these terms carefully before using our services.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed">
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">1</span>
                            Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using our platform, you agree to be bound by these Terms and Conditions 
                            and all applicable laws and regulations. If you do not agree with any of these terms, 
                            you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">2</span>
                            User Accounts
                        </h2>
                        <p>
                            To access certain features, you may be required to create an account. You are responsible 
                            for maintaining the confidentiality of your account and password and for restricting access 
                            to your computer.
                        </p>
                    </section>

                    <section className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-400 mb-4">
                            3. Prohibited Activities
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-amber-800 dark:text-amber-300/80">
                            <li>Modifying or copying the materials.</li>
                            <li>Using the materials for any commercial purpose.</li>
                            <li>Attempting to decompile or reverse engineer any software contained on the platform.</li>
                            <li>Removing any copyright or other proprietary notations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">4</span>
                            Intellectual Property
                        </h2>
                        <p>
                            The service and its original content, features, and functionality are and will remain 
                            the exclusive property of the company and its licensors.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">5</span>
                            Termination
                        </h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, 
                            for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="mb-6 italic">
                            Do you have any questions regarding these terms?
                        </p>
                        <Button variant="primary" className="rounded-full px-10">
                            Contact Support
                        </Button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;