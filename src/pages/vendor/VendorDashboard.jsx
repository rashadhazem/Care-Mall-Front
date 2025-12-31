import React from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PageWrapper from '../../components/ui/PageWrapper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VendorDashboard = () => {
    // Mock Data
    const stats = [
        { label: 'Total Sales', value: '$12,450', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: '1,240', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { label: 'Products', value: '45', icon: Package, color: 'bg-purple-100 text-purple-600' },
        { label: 'Growth', value: '+15%', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600' },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales ($)',
                data: [3000, 4500, 4000, 6000, 5500, 8000],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Sales Performance' },
        },
    };

    return (
        <PageWrapper className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Vendor Dashboard</h1>

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
