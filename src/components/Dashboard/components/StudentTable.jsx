import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Avatar, 
  Dropdown, 
  Typography,
  Badge,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const StudentTable = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Sample student data
  const studentsData = [
    {
      key: '1',
      id: 'STU001',
      name: 'John Smith',
      email: 'john.smith@university.edu',
      phone: '+1 234 567 8900',
      department: 'Computer Science',
      year: '3rd Year',
      gpa: 3.8,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      lastLogin: '2 hours ago',
      feesStatus: 'paid',
    },
    {
      key: '2',
      id: 'STU002',
      name: 'Emily Johnson',
      email: 'emily.johnson@university.edu',
      phone: '+1 234 567 8901',
      department: 'Business Admin',
      year: '2nd Year',
      gpa: 3.6,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      lastLogin: '1 day ago',
      feesStatus: 'pending',
    },
    {
      key: '3',
      id: 'STU003',
      name: 'Michael Brown',
      email: 'michael.brown@university.edu',
      phone: '+1 234 567 8902',
      department: 'Engineering',
      year: '4th Year',
      gpa: 3.9,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      lastLogin: '3 hours ago',
      feesStatus: 'paid',
    },
    {
      key: '4',
      id: 'STU004',
      name: 'Sarah Davis',
      email: 'sarah.davis@university.edu',
      phone: '+1 234 567 8903',
      department: 'Liberal Arts',
      year: '1st Year',
      gpa: 3.7,
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      lastLogin: '1 week ago',
      feesStatus: 'overdue',
    },
    {
      key: '5',
      id: 'STU005',
      name: 'David Wilson',
      email: 'david.wilson@university.edu',
      phone: '+1 234 567 8904',
      department: 'Sciences',
      year: '3rd Year',
      gpa: 3.5,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      lastLogin: '5 hours ago',
      feesStatus: 'paid',
    },
  ];

  const actionMenuItems = (record) => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Profile',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit Student',
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
    },
  ];

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            src={record.avatar}
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {text}
            </div>
            <div className="text-sm text-gray-500">
              ID: {record.id}
            </div>
          </div>
        </div>
      ),
      filterable: true,
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MailOutlined className="mr-2 text-blue-500" />
            <Text copyable={{ text: record.email }} className="text-xs">
              {record.email.length > 20 ? `${record.email.substring(0, 20)}...` : record.email}
            </Text>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <PhoneOutlined className="mr-2 text-green-500" />
            <Text copyable={{ text: record.phone }} className="text-xs">
              {record.phone}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (text) => (
        <Tag color="blue" className="rounded-full">
          {text}
        </Tag>
      ),
      filters: [
        { text: 'Computer Science', value: 'Computer Science' },
        { text: 'Business Admin', value: 'Business Admin' },
        { text: 'Engineering', value: 'Engineering' },
        { text: 'Liberal Arts', value: 'Liberal Arts' },
        { text: 'Sciences', value: 'Sciences' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 100,
      sorter: (a, b) => a.year.localeCompare(b.year),
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      width: 80,
      render: (gpa) => (
        <Badge
          count={gpa}
          style={{
            backgroundColor: gpa >= 3.7 ? '#52c41a' : gpa >= 3.0 ? '#faad14' : '#ff4d4f',
            borderRadius: '12px',
            padding: '0 8px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        />
      ),
      sorter: (a, b) => a.gpa - b.gpa,
    },
    {
      title: 'Fees Status',
      dataIndex: 'feesStatus',
      key: 'feesStatus',
      width: 120,
      render: (status) => {
        const statusConfig = {
          paid: { color: 'success', text: 'Paid' },
          pending: { color: 'warning', text: 'Pending' },
          overdue: { color: 'error', text: 'Overdue' },
        };
        return (
          <Tag 
            color={statusConfig[status].color}
            className="rounded-full font-medium"
          >
            {statusConfig[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Pending', value: 'pending' },
        { text: 'Overdue', value: 'overdue' },
      ],
      onFilter: (value, record) => record.feesStatus === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag 
          color={status === 'active' ? 'success' : 'default'}
          className="rounded-full font-medium"
        >
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 120,
      render: (text) => (
        <Text type="secondary" className="text-xs">
          {text}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{ 
            items: actionMenuItems(record),
            onClick: ({ key }) => {
              console.log(`Action ${key} for student ${record.name}`);
            }
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    preserveSelectedRowKeys: true,
  };

  const filteredData = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.email.toLowerCase().includes(searchText.toLowerCase()) ||
    student.id.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card
      title="Recent Students"
      extra={
        <Space>
          <Input
            placeholder="Search students..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary">
            Add Student
          </Button>
        </Space>
      }
      className="hover:shadow-lg transition-all duration-300"
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        rowSelection={rowSelection}
        size="middle"
        scroll={{ x: 1200 }}
        pagination={{
          total: filteredData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
        }}
        className="rounded-lg"
      />
    </Card>
  );
};

export default StudentTable;
