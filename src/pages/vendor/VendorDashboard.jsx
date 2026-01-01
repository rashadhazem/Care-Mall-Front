import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PageWrapper from '../../components/ui/PageWrapper';
import { productsApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VendorDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState([
        { label: 'Total Sales', value: '$0', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { label: 'Products', value: '0', icon: Package, color: 'bg-purple-100 text-purple-600' },
        { label: 'Growth', value: '0%', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600' },
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Products Count
                const productsRes = await productsApi.getProducts();
                const productsCount = productsRes.data.data?.length || 0;

                // Update Stats
                setStats(prev => [
                    { ...prev[0], label: t('total_sales') },
                    { ...prev[1], label: t('total_orders') },
                    { ...prev[2], value: productsCount.toString(), label: t('products') },
                    { ...prev[3], label: t('growth') }
                ]);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [t]);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: t('sales'),
                data: [0, 0, 0, 0, 0, 0], // Placeholder data
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: t('monthly_sales_performance') },
        },
    };

    return (
        <PageWrapper className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">{t('vendor_dashboard')}</h1>

            {/* Stats Grid */}
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <Line options={chartOptions} data={chartData} />
            </div>
        </PageWrapper>
    );
};

export default VendorDashboard;
