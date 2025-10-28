import React, { useState } from 'react';
import { Row, Col, Card, Select, Typography, Segmented } from 'antd';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

const ChartsSection = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('line');

  // Sample data for student enrollment
  const enrollmentData = [
    { month: 'Jan', students: 2400, faculty: 140, revenue: 800000 },
    { month: 'Feb', students: 2500, faculty: 142, revenue: 820000 },
    { month: 'Mar', students: 2600, faculty: 145, revenue: 850000 },
    { month: 'Apr', students: 2650, faculty: 148, revenue: 870000 },
    { month: 'May', students: 2700, faculty: 150, revenue: 890000 },
    { month: 'Jun', students: 2750, faculty: 152, revenue: 910000 },
    { month: 'Jul', students: 2800, faculty: 154, revenue: 930000 },
    { month: 'Aug', students: 2847, faculty: 156, revenue: 950000 },
  ];

  // Department distribution data
  const departmentData = [
    { name: 'Computer Science', value: 850, color: '#8884d8' },
    { name: 'Business Admin', value: 650, color: '#82ca9d' },
    { name: 'Engineering', value: 580, color: '#ffc658' },
    { name: 'Liberal Arts', value: 420, color: '#ff7c7c' },
    { name: 'Sciences', value: 347, color: '#8dd1e1' },
  ];

  // Performance metrics data
  const performanceData = [
    { subject: 'Mathematics', passed: 85, failed: 15 },
    { subject: 'Physics', passed: 78, failed: 22 },
    { subject: 'Chemistry', passed: 82, failed: 18 },
    { subject: 'Biology', passed: 88, failed: 12 },
    { subject: 'English', passed: 92, failed: 8 },
    { subject: 'History', passed: 76, failed: 24 },
  ];

  // Attendance trend data
  const attendanceData = [
    { day: 'Mon', attendance: 94 },
    { day: 'Tue', attendance: 87 },
    { day: 'Wed', attendance: 91 },
    { day: 'Thu', attendance: 89 },
    { day: 'Fri', attendance: 85 },
    { day: 'Sat', attendance: 78 },
    { day: 'Sun', attendance: 82 },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enrollment Trends Chart */}
      <Card 
        title={
          <div className="flex justify-between items-center">
            <Title level={4} className="!mb-0">Enrollment Trends</Title>
            <div className="flex items-center space-x-3">
              <Segmented
                options={[
                  { label: 'Line', value: 'line' },
                  { label: 'Area', value: 'area' },
                  { label: 'Bar', value: 'bar' },
                ]}
                value={chartType}
                onChange={setChartType}
                size="small"
              />
              <Select
                value={timeRange}
                onChange={setTimeRange}
                size="small"
                style={{ width: 120 }}
              >
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="quarter">This Quarter</Option>
                <Option value="year">This Year</Option>
              </Select>
            </div>
          </div>
        }
        className="hover:shadow-lg transition-all duration-300"
      >
        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'line' && (
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#1890ff"
                strokeWidth={3}
                dot={{ fill: '#1890ff', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="faculty"
                stroke="#52c41a"
                strokeWidth={3}
                dot={{ fill: '#52c41a', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          )}
          
          {chartType === 'area' && (
            <AreaChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="students"
                stackId="1"
                stroke="#1890ff"
                fill="#1890ff"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="faculty"
                stackId="1"
                stroke="#52c41a"
                fill="#52c41a"
                fillOpacity={0.6}
              />
            </AreaChart>
          )}
          
          {chartType === 'bar' && (
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#1890ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="faculty" fill="#52c41a" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>

      {/* Bottom row charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Department Distribution" 
            className="hover:shadow-lg transition-all duration-300"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="Subject Performance" 
            className="hover:shadow-lg transition-all duration-300"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#8884d8" />
                <YAxis dataKey="subject" type="category" stroke="#8884d8" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="passed" stackId="a" fill="#52c41a" />
                <Bar dataKey="failed" stackId="a" fill="#ff4d4f" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Weekly Attendance Chart */}
      <Card 
        title="Weekly Attendance Trend" 
        className="hover:shadow-lg transition-all duration-300"
      >
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#8884d8" />
            <YAxis stroke="#8884d8" domain={[70, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Attendance']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#722ed1"
              fill="#722ed1"
              fillOpacity={0.3}
              strokeWidth={3}
              dot={{ fill: '#722ed1', strokeWidth: 2, r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ChartsSection;
