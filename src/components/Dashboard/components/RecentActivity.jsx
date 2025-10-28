import React from 'react';
import { Card, Timeline, Avatar, Typography, Badge, Space, Button } from 'antd';
import {
  UserAddOutlined,
  BookOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'student_registration',
      title: 'New Student Registration',
      description: 'John Smith registered for Computer Science program',
      timestamp: '2 minutes ago',
      icon: <UserAddOutlined />,
      color: '#52c41a',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      status: 'success',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Fee Payment Received',
      description: 'Emily Johnson paid semester fees ₹45,000',
      timestamp: '15 minutes ago',
      icon: <DollarOutlined />,
      color: '#1890ff',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      status: 'info',
    },
    {
      id: 3,
      type: 'course_enrollment',
      title: 'Course Enrollment',
      description: '25 students enrolled in Advanced Mathematics',
      timestamp: '1 hour ago',
      icon: <BookOutlined />,
      color: '#722ed1',
      status: 'processing',
    },
    {
      id: 4,
      type: 'faculty_meeting',
      title: 'Faculty Meeting Scheduled',
      description: 'Monthly faculty meeting scheduled for tomorrow',
      timestamp: '2 hours ago',
      icon: <CalendarOutlined />,
      color: '#faad14',
      status: 'warning',
    },
    {
      id: 5,
      type: 'staff_addition',
      title: 'New Staff Member',
      description: 'Dr. Sarah Wilson joined as Assistant Professor',
      timestamp: '3 hours ago',
      icon: <TeamOutlined />,
      color: '#13c2c2',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      status: 'success',
    },
    {
      id: 6,
      type: 'exam_schedule',
      title: 'Exam Schedule Released',
      description: 'Mid-semester examination schedule published',
      timestamp: '4 hours ago',
      icon: <FileTextOutlined />,
      color: '#eb2f96',
      status: 'info',
    },
    {
      id: 7,
      type: 'library_book',
      title: 'Library Update',
      description: '150 new books added to the library catalog',
      timestamp: '5 hours ago',
      icon: <BookOutlined />,
      color: '#52c41a',
      status: 'success',
    },
    {
      id: 8,
      type: 'system_maintenance',
      title: 'System Maintenance',
      description: 'Scheduled maintenance completed successfully',
      timestamp: '6 hours ago',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      status: 'success',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'processing':
        return <ClockCircleOutlined style={{ color: '#722ed1' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const timelineItems = activities.map((activity) => ({
    key: activity.id,
    dot: (
      <div className="relative">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
          style={{ backgroundColor: activity.color }}
        >
          {activity.icon}
        </div>
        <div className="absolute -top-1 -right-1">
          {getStatusIcon(activity.status)}
        </div>
      </div>
    ),
    children: (
      <div className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Text strong className="text-gray-900 dark:text-white">
                {activity.title}
              </Text>
              {activity.avatar && (
                <Avatar size={20} src={activity.avatar} />
              )}
            </div>
            <Text type="secondary" className="text-sm block mb-2">
              {activity.description}
            </Text>
            <div className="flex items-center space-x-1">
              <ClockCircleOutlined className="text-xs text-gray-400" />
              <Text type="secondary" className="text-xs">
                {activity.timestamp}
              </Text>
            </div>
          </div>
        </div>
      </div>
    ),
  }));

  // Quick stats for the activity card
  const quickStats = [
    { label: 'New Students Today', value: 12, color: '#52c41a' },
    { label: 'Pending Approvals', value: 8, color: '#faad14' },
    { label: 'Active Sessions', value: 245, color: '#1890ff' },
    { label: 'System Alerts', value: 3, color: '#ff4d4f' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Mini Cards */}
      <Card 
        title="Quick Overview" 
        size="small"
        className="hover:shadow-lg transition-all duration-300"
      >
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <Text type="secondary" className="text-xs">
                {stat.label}
              </Text>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity Timeline */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <Space>
              <Title level={5} className="!mb-0">Recent Activity</Title>
              <Badge count={activities.length} style={{ backgroundColor: '#52c41a' }} />
            </Space>
          </div>
        }
        extra={
          <Button type="link" size="small">
            View All
          </Button>
        }
        className="hover:shadow-lg transition-all duration-300"
        bodyStyle={{ maxHeight: 500, overflowY: 'auto' }}
      >
        <Timeline
          items={timelineItems}
          mode="left"
          className="activity-timeline"
        />
      </Card>

      {/* System Status */}
      <Card 
        title="System Status" 
        size="small"
        className="hover:shadow-lg transition-all duration-300"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Text className="text-sm">Database Connection</Text>
            </div>
            <Text type="secondary" className="text-xs">Online</Text>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Text className="text-sm">Payment Gateway</Text>
            </div>
            <Text type="secondary" className="text-xs">Active</Text>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <Text className="text-sm">Email Service</Text>
            </div>
            <Text type="secondary" className="text-xs">Slow</Text>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Text className="text-sm">Backup System</Text>
            </div>
            <Text type="secondary" className="text-xs">Running</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecentActivity;
