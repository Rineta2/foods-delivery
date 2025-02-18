'use client';

import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

export default function SuperAdminDashboardPage() {
    // Sample data for charts
    const salesData = [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 6000 },
        { name: 'Thu', value: 4000 },
        { name: 'Fri', value: 5000 },
        { name: 'Sat', value: 7000 },
        { name: 'Sun', value: 6500 },
    ];

    const categoryData = [
        { name: 'Main Course', value: 35, color: '#FF6B6B' },
        { name: 'Beverages', value: 25, color: '#4ECDC4' },
        { name: 'Desserts', value: 20, color: '#45B7D1' },
        { name: 'Appetizers', value: 20, color: '#96CEB4' },
    ];

    const topSellingItems = [
        { id: 1, name: 'Spicy Chicken Burger', sales: 234, image: '🍔', trend: '+12%' },
        { id: 2, name: 'Classic Pizza', sales: 186, image: '🍕', trend: '+8%' },
        { id: 3, name: 'Caesar Salad', sales: 142, image: '🥗', trend: '+5%' },
    ];

    const [chartWidth, setChartWidth] = React.useState(600);

    React.useEffect(() => {
        const handleResize = () => {
            setChartWidth(window.innerWidth < 768 ? 400 : 600);
        };

        handleResize(); // Set initial width
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {/* Stats Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <FiTrendingUp className="w-6 h-6 text-orange-500" />
                    </div>
                    <span className="text-green-500 text-sm font-medium">+12.5%</span>
                </div>
                <h3 className="text-2xl font-bold mt-4">$12,426</h3>
                <p className="text-gray-600 text-sm">Total Revenue</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUsers className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-green-500 text-sm font-medium">+5.2%</span>
                </div>
                <h3 className="text-2xl font-bold mt-4">1,245</h3>
                <p className="text-gray-600 text-sm">Total Customers</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FiShoppingBag className="w-6 h-6 text-green-500" />
                    </div>
                    <span className="text-green-500 text-sm font-medium">+8.4%</span>
                </div>
                <h3 className="text-2xl font-bold mt-4">456</h3>
                <p className="text-gray-600 text-sm">Total Orders</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiDollarSign className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="text-green-500 text-sm font-medium">+6.8%</span>
                </div>
                <h3 className="text-2xl font-bold mt-4">$28.5</h3>
                <p className="text-gray-600 text-sm">Avg. Order Value</p>
            </div>

            {/* Sales Chart */}
            <div className="col-span-full lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-lg font-semibold">Sales Overview</h3>
                    <select className="text-sm border rounded-lg px-3 py-2 w-full md:w-auto">
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>
                <div className="relative w-full h-[300px] overflow-x-auto custom-scrollbar">
                    <LineChart width={chartWidth} height={300} data={salesData}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#FF6B6B"
                            strokeWidth={3}
                            dot={{ fill: '#FF6B6B', strokeWidth: 2 }}
                        />
                    </LineChart>
                </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
                <div className="relative h-[250px] flex justify-center overflow-auto custom-scrollbar">
                    <PieChart width={200} height={200}>
                        <Pie
                            data={categoryData}
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
                <div className="mt-4 space-y-2 max-h-[200px] relative overflow-y-auto custom-scrollbar">
                    {categoryData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-600">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Top Selling Items</h3>
                <div className="relative space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {topSellingItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">{item.image}</div>
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.sales} orders</p>
                                </div>
                            </div>
                            <span className="text-green-500 text-sm font-medium">{item.trend}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}