import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Users, DollarSign, ShoppingBag, Activity } from 'lucide-react';
import PageWrapper from '../../components/ui/PageWrapper';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
        document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    // Mock Data
    const stats = [
        { label: 'Total Revenue', value: '$45,231', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Total Users', value: '2,340', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Orders Today', value: '145', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
        { label: 'System Health', value: '98%', icon: Activity, color: 'bg-yellow-100 text-yellow-600' },
    ];
    // ... stats logic ...

    const revenueData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: [1200, 1900, 3000, 5000, 2000, 3200, 4500],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            },
        ],
    };

    const userData = {
        labels: ['Active', 'Inactive', 'New'],
        datasets: [
            {
                data: [1400, 400, 500],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(234, 179, 8, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

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
                    <h2 className="text-lg font-bold mb-4 dark:text-white">Weekly Revenue</h2>
                    <Bar data={revenueData} options={{ responsive: true }} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-4 dark:text-white">User Distribution</h2>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={userData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminDashboard;
