import React, { useState, useEffect,useMemo } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp,Boxes } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PageWrapper from '../../components/ui/PageWrapper';
import { productsApi,statisticsApi } from '../../lib/api';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VendorDashboard = () => {
    const { t } = useTranslation();
    const [storeName,setStoreName]=useState('');
    const [loading,setLoading]=useState(false);
    const [monthlySales,setMonthlySales]=useState([]);
    
    const [statsData, setStatsData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Products Count
                setLoading(true);
                 const {data} = await statisticsApi.getVendorStatistics();
                
                 setStoreName(data.storeName);
                 
                 console.log("res",data);
                // Update Stats
                setStatsData(data);
                setMonthlySales(data.monthlySales || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
            finally{
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [t]);
    const growth = useMemo(() => {
            if (monthlySales.length < 2) return 0;

            const last = monthlySales[monthlySales.length - 1].revenue;
            const prev = monthlySales[monthlySales.length - 2].revenue;

            if (prev === 0) return 100;
            return (((last - prev) / prev) * 100).toFixed(1);
        }, [monthlySales]);


const stats = statsData && [
    {
      label: t('total_sales'),
      value: `$${statsData.revenue}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: t('total_orders'),
      value: statsData.orders,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: t('products'),
      value: statsData.products,
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: t('sold_products'),
      value: statsData.soldProducts,
      icon: Boxes,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      label: t('growth'),
      value: `${growth}%`,
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];
 console.log("statsData",stats)
  if (!statsData) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>;
  }

    const chartData = {
        labels: monthlySales.map(item=>item.month),
        datasets: [
            {
                label: t('sales'),
                data: monthlySales.map(item=>item.revenue), // Placeholder data
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
            <h1 className="text-2xl font-bold dark:text-white">{t('vendor_dashboard')} </h1>
            <p className="text-lg font-semibold dark:text-white">{storeName}</p>

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
