import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBook, 
  FaRupeeSign,
  FaUserGraduate,
  FaUserPlus,
  FaFileAlt,
  FaChartLine 
} from 'react-icons/fa';
import { 
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md';

const SimpleDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+11.2%',
      positive: true,
      color: 'bg-blue-500',
      icon: <FaUsers className="text-2xl" />
    },
    {
      title: 'Total Faculty',
      value: '156',
      change: '+3.2%',
      positive: true,
      color: 'bg-green-500',
      icon: <FaChalkboardTeacher className="text-2xl" />
    },
    {
      title: 'Total Courses',
      value: '94',
      change: '-2.1%',
      positive: false,
      color: 'bg-orange-500',
      icon: <FaBook className="text-2xl" />
    },
    {
      title: 'Revenue',
      value: '₹98.4L',
      change: '+15.3%',
      positive: true,
      color: 'bg-purple-500',
      icon: <FaRupeeSign className="text-2xl" />
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New Student Registration',
      description: 'John Smith registered for Computer Science',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Fee Payment Received',
      description: 'Emily Johnson paid semester fees ₹45,000',
      time: '15 minutes ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'Course Enrollment',
      description: '25 students enrolled in Advanced Mathematics',
      time: '1 hour ago',
      type: 'warning'
    },
    {
      id: 4,
      title: 'Faculty Meeting',
      description: 'Monthly faculty meeting scheduled',
      time: '2 hours ago',
      type: 'info'
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header className="border-b shadow-sm" style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--border-color)' 
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  UniAdmin Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AD</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stat.value}
                  </p>
                  <p className={`text-sm flex items-center ${
                    stat.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.positive ? <MdTrendingUp className="mr-1" /> : <MdTrendingDown className="mr-1" />}
                    {stat.change} vs last month
                  </p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border shadow-sm p-6" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)' 
            }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Enrollment Trends
              </h3>
              
              {/* Simple Chart Placeholder */}
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg" style={{ 
                borderColor: 'var(--border-color)' 
              }}>
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <FaChartLine className="text-6xl" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Interactive Chart
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Install Ant Design for advanced charts
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Progress */}
            <div className="rounded-xl border shadow-sm p-6 mt-6" style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)' 
            }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Today's Attendance
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    86.3%
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    2,456 / 2,847 students present
                  </p>
                </div>
                
                <div className="w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      style={{ color: 'var(--border-color)' }}
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${86.3 * 2.26} ${(100 - 86.3) * 2.26}`}
                      className="text-blue-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      86%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border shadow-sm p-6" style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)' 
          }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {activity.title}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {activity.description}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/dashboards')}
              className="w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors btn-outline"
            >
              View All Activities
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border shadow-sm p-6 mt-8" style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)' 
        }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/students/add')}
              className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="mb-3 flex justify-center"><FaUserGraduate className="text-2xl" /></div>
              <div className="text-sm font-semibold">Add Student</div>
            </button>
            
            <button
              onClick={() => navigate('/employees/add')}
              className="bg-green-500 hover:bg-green-600 transition-all duration-200 text-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="mb-3 flex justify-center"><FaUserPlus className="text-2xl" /></div>
              <div className="text-sm font-semibold">Add Faculty</div>
            </button>
            
            <button
              onClick={() => navigate('/admit-cards/add')}
              className="bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="mb-3 flex justify-center"><FaBook className="text-2xl" /></div>
              <div className="text-sm font-semibold">Create Course</div>
            </button>
            
            <button
              onClick={() => navigate('/accounts')}
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="mb-3 flex justify-center"><FaChartLine className="text-2xl" /></div>
              <div className="text-sm font-semibold">Generate Report</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimpleDashboard;
