import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Users, DollarSign, ShoppingBag, Activity } from 'lucide-react';
import PageWrapper from '../../components/ui/PageWrapper';
import { useTranslation } from 'react-i18next';
import { statisticsApi } from '../../lib/api';
import { showToast } from '../../lib/toast';
import { Globe } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const { t, i18n } = useTranslation();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
        document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    // Load statistics from API
    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await statisticsApi.getAdminStatistics();
                setDashboardData(res.data?.data || res.data || {});
            } catch (error) {
                console.error('Error loading admin stats', error);
                showToast('error', 'Failed to load admin statistics');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    // Derived State with Translations
    const stats = React.useMemo(() => {
        const d = dashboardData || {};
        return [
            { label: t('total_sales'), value: d.totalSales !== undefined ? `$${d.totalSales}` : '$0', icon: DollarSign, color: 'bg-green-100 text-green-600' },
            { label: t('total_users'), value: d.users ?? 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
            { label: t('products'), value: d.products ?? 0, icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
            { label: t('stores'), value: d.stores ?? 0, icon: Activity, color: 'bg-yellow-100 text-yellow-600' },
        ];
    }, [dashboardData, t]);

    const revenueData = React.useMemo(() => {
        const d = dashboardData || {};
        if (d.revenueByDay && Array.isArray(d.revenueByDay.values)) {
            return {
                labels: d.revenueByDay.labels || [],
                datasets: [{ label: `${t('revenue')} ($)`, data: d.revenueByDay.values, backgroundColor: 'rgba(59, 130, 246, 0.7)' }]
            };
        }
        return {
            labels: [t('total')],
            datasets: [{ label: `${t('revenue')} ($)`, data: [d.totalSales || 0], backgroundColor: 'rgba(59, 130, 246, 0.7)' }]
        };
    }, [dashboardData, t]);

    const userData = React.useMemo(() => {
        const d = dashboardData || {};
        const vendorsCount = d.vendors ?? 0;
        const usersCount = d.users ?? 0;
        return {
            labels: [t('vendors'), t('user')],
            datasets: [{
                data: [vendorsCount, usersCount],
                backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                borderColor: ['rgba(34,197,94,1)', 'rgba(239,68,68,1)'],
                borderWidth: 1
            }]
        };
    }, [dashboardData, t]);

    return (
        <PageWrapper className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">{t('dashboard')}</h1>
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <Globe size={20} className="text-gray-500" />
                    <span className="text-sm font-medium">{i18n.language === 'en' ? 'العربية' : 'English'}</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-4 dark:text-white">{t('weekly_revenue')}</h2>
                    <Bar data={revenueData} options={{ responsive: true }} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-4 dark:text-white">{t('user_distribution')}</h2>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={userData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminDashboard;
