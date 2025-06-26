import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RevenueManagement = () => {
  const [data] = useState({
    totalRevenue: 12000000,
    monthlyRevenue: [
      { month: '2025-01', revenue: 1500000 },
      { month: '2025-02', revenue: 2000000 },
      { month: '2025-03', revenue: 2500000 },
      { month: '2025-04', revenue: 3000000 },
      { month: '2025-05', revenue: 1800000 },
    ],
    planBreakdown: [
      { planName: 'Basic', revenue: 3000000 },
      { planName: 'Premium', revenue: 9000000 },
    ],
    subscriberCount: 125,
  });

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Thống kê Doanh thu (Admin)</h1>

      <div className="w-full overflow-x-auto pb-4">
        <div className="inline-flex space-x-4 min-w-max">
          <div className="bg-white shadow rounded-xl p-4 w-[250px] flex-shrink-0">
            <h2 className="text-lg font-semibold">Tổng doanh thu</h2>
            <p className="text-2xl text-green-600">{(data.totalRevenue ?? 0).toLocaleString()} VNĐ</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 w-[250px] flex-shrink-0">
            <h2 className="text-lg font-semibold">Số người dùng trả phí</h2>
            <p className="text-2xl text-blue-600">{data.subscriberCount}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4 w-[500px] flex-shrink-0">
            <h2 className="text-lg font-semibold mb-2">Doanh thu theo tháng</h2>
            <LineChart width={400} height={250} data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </div>

          <div className="bg-white shadow rounded-xl p-4 w-[500px] flex-shrink-0">
            <h2 className="text-lg font-semibold mb-2">Doanh thu theo gói</h2>
            <BarChart width={400} height={250} data={data.planBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="planName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </div>

          <div className="bg-white shadow rounded-xl p-4 w-[400px] flex-shrink-0">
            <h2 className="text-lg font-semibold mb-2">Phân bố theo gói (Pie Chart)</h2>
            <PieChart width={300} height={250}>
              <Pie
                data={data.planBreakdown ?? []}
                dataKey="revenue"
                nameKey="planName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {(data.planBreakdown ?? []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;
