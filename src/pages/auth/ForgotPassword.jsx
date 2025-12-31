import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/ui/PageWrapper';
import { authAPI } from '../../lib/api';
import { showToast } from '../../lib/toast';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock API call
        if (email) {
            Swal.fire({
                icon: 'success',
                title: 'Reset Link Sent',
                text: `A reset link has been sent to ${email}`,
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    return (
        <PageWrapper className="flex min-h-[80vh] font-poppins items-center justify-center">
            <div className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-gray-800 p-8 md:p-12 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t("Forgot Password?")}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Enter your email to receive reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ForgotPassword;
