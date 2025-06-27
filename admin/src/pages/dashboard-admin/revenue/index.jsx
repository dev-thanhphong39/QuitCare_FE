import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import './dashboard-revenue.css';
import logo from "../../../assets/images/logo.png";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RevenueStatistics = () => {
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
   
    <div className="revenue-container">
       <div className="revenue-headercontainer">
       <div className="box-header1">
       <img src={logo} alt="Quit Care Logo" className="qc-logo-dashboard" />
       <div className='qc-name'>Quit Care</div>
       </div>
       <div className="box-header2">Thống kê doanh thu</div>
       <div className="box-header3"  >date time</div> 
       </div>
      

      <div className="revenue-scroll">
        <div className="revenue-cards">
          <div className="card card-250">
            <h2 className="card-title">Tổng doanh thu</h2>
            <p className="card-value-green">{(data.totalRevenue ?? 0).toLocaleString()} VNĐ</p>
          </div>

          <div className="card card-250">
            <h2 className="card-title">Tổng doanh thu</h2>
            <p className="card-value-green">{(data.totalRevenue ?? 0).toLocaleString()} VNĐ</p>
          </div>
          <div className="card card-250">
            <h2 className="card-title">Tổng doanh thu</h2>
            <p className="card-value-green">{(data.totalRevenue ?? 0).toLocaleString()} VNĐ</p>
          </div>

          <div className="card card-250">
            <h2 className="card-title">Số người dùng trả phí</h2>
            <p className="card-value-blue">{data.subscriberCount}</p>
          </div>
          </div>
<div className='chart-container'>
<div className="card card-500-1">
            <h2 className="card-title">Doanh thu theo tháng</h2>
            <LineChart width={400} height={250} data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </div>

          <div className="card card-500-2">
            <h2 className="card-title">Doanh thu theo gói</h2>
            <BarChart width={400} height={250} data={data.planBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="planName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </div>
</div>
          

          <div className="card card-400">
            <h2 className="card-title">Phân bố theo gói (Pie Chart)</h2>
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
  );
};

export default RevenueStatistics;
