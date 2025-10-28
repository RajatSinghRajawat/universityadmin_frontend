import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  Table,
  Tag,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  DownOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import StatsCards from './components/StatsCards';
import ChartsSection from './components/ChartsSection';
import RecentActivity from './components/RecentActivity';
import StudentTable from './components/StudentTable';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const AnalyticsDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    switch (e.key) {
      case '2':
        navigate('/students');
        break;
      case '3':
        navigate('/employees');
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Students',
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: 'Employees',
    },
    {
      key: '4',
      icon: <BookOutlined />,
      label: 'Academics',
      children: [
        { key: '4-1', label: 'Courses' },
        { key: '4-2', label: 'Subjects' },
        { key: '4-3', label: 'Syllabus' },
      ],
    },
    {
      key: '5',
      icon: <CalendarOutlined />,
      label: 'Attendance',
    },
    {
      key: '6',
      icon: <FileTextOutlined />,
      label: 'Admit Cards',
    },
    {
      key: '7',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`shadow-lg transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        width={256}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <DashboardOutlined className="text-white text-lg" />
            </div>
            {!collapsed && (
              <div>
                <Title level={4} className="!mb-0 !text-gray-800 dark:!text-white">
                  UniAdmin
                </Title>
                <Text type="secondary" className="text-xs">
                  University Management
                </Text>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          className="border-none"
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header className={`px-6 shadow-sm border-b border-gray-200 dark:border-gray-700 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-4">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg"
              />
              <div>
                <Title level={4} className="!mb-0">
                  Analytics Dashboard
                </Title>
                <Text type="secondary">Welcome back, Admin</Text>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="text"
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className="text-lg"
              />
              
              <Badge count={5}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="text-lg"
                />
              </Badge>

              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
              >
                <Space className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                  <Avatar
                    size={32}
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  />
                  <div className="hidden sm:block">
                    <Text strong>John Doe</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      Administrator
                    </Text>
                  </div>
                  <DownOutlined className="text-xs" />
                </Space>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="space-y-6">
            {/* Stats Cards */}
            <StatsCards />

            {/* Charts Section */}
            <ChartsSection />

            {/* Bottom Section */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <StudentTable />
              </Col>
              <Col xs={24} lg={8}>
                <RecentActivity />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AnalyticsDashboard;
