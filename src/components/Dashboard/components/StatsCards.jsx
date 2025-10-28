import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const StatsCards = () => {
  const statsData = [
    {
      title: 'Total Students',
      value: 2847,
      prefix: <UserOutlined />,
      suffix: null,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      trend: { value: 11.28, isPositive: true },
      description: 'vs last month',
      color: '#1890ff',
      bgGradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Faculty',
      value: 156,
      prefix: <TeamOutlined />,
      suffix: null,
      precision: 0,
      valueStyle: { color: '#cf1322' },
      trend: { value: 3.2, isPositive: true },
      description: 'vs last month',
      color: '#52c41a',
      bgGradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Courses',
      value: 94,
      prefix: <BookOutlined />,
      suffix: null,
      precision: 0,
      valueStyle: { color: '#1890ff' },
      trend: { value: 2.1, isPositive: false },
      description: 'vs last month',
      color: '#faad14',
      bgGradient: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Revenue',
      value: 984567,
      prefix: <DollarOutlined />,
      suffix: null,
      precision: 0,
      valueStyle: { color: '#722ed1' },
      trend: { value: 15.3, isPositive: true },
      description: 'vs last month',
      color: '#722ed1',
      bgGradient: 'from-purple-500 to-purple-600',
    },
  ];

  const attendanceData = {
    present: 2456,
    total: 2847,
    percentage: 86.3,
  };

  return (
    <>
      <Row gutter={[24, 24]}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0"
              bodyStyle={{ padding: '24px' }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.bgGradient} opacity-10 rounded-bl-full`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                    <div className="text-white text-xl">
                      {stat.prefix}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-sm ${
                      stat.trend.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.trend.isPositive ? (
                        <ArrowUpOutlined className="mr-1" />
                      ) : (
                        <ArrowDownOutlined className="mr-1" />
                      )}
                      {stat.trend.value}%
                    </div>
                    <Text type="secondary" className="text-xs">
                      {stat.description}
                    </Text>
                  </div>
                </div>
                
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  precision={stat.precision}
                  valueStyle={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    color: stat.color 
                  }}
                  className="mb-0"
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Attendance Progress Card */}
      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} sm={12} lg={8}>
          <Card 
            title="Today's Attendance" 
            className="hover:shadow-lg transition-all duration-300"
            extra={
              <Text type="secondary" className="text-sm">
                {new Date().toLocaleDateString()}
              </Text>
            }
          >
            <div className="text-center">
              <Progress
                type="circle"
                percent={attendanceData.percentage}
                size={120}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                strokeWidth={8}
                format={(percent) => (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {percent}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Present
                    </div>
                  </div>
                )}
              />
              <div className="mt-4 text-center">
                <Text className="text-lg font-semibold">
                  {attendanceData.present}/{attendanceData.total}
                </Text>
                <br />
                <Text type="secondary">Students Present Today</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Quick Stats" className="hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text>Active Courses</Text>
                <Text strong className="text-blue-600">87</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Pending Admissions</Text>
                <Text strong className="text-orange-600">23</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Overdue Fees</Text>
                <Text strong className="text-red-600">145</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Library Books</Text>
                <Text strong className="text-green-600">12,567</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="System Health" className="hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Server CPU</Text>
                  <Text>68%</Text>
                </div>
                <Progress percent={68} strokeColor="#52c41a" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Memory Usage</Text>
                  <Text>45%</Text>
                </div>
                <Progress percent={45} strokeColor="#1890ff" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Storage</Text>
                  <Text>82%</Text>
                </div>
                <Progress percent={82} strokeColor="#faad14" size="small" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatsCards;
