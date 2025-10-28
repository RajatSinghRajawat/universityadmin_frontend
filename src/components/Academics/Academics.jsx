import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdTabletMac, 
  MdCalendarToday, 
  MdMenuBook, 
  MdGroups,
  MdArrowForward
} from 'react-icons/md';

const Academics = () => {
  const navigate = useNavigate();

  const academicCards = [
    {
      id: 'courses',
      title: 'Courses / Classes',
      description: 'Total Courses Active: 3',
      icon: <MdTabletMac className="text-2xl" />,
      bgColor: 'bg-pink-500',
      route: '/academics/courses'
    },
    {
      id: 'sessions',
      title: 'Sessions',
      description: 'Total Sessions: 2',
      icon: <MdCalendarToday className="text-2xl" />,
      bgColor: 'bg-green-500',
      route: '/academics/sessions'
    },
    {
      id: 'subjects',
      title: 'Subjects',
      description: 'Total Subjects Active: 4',
      icon: <MdMenuBook className="text-2xl" />,
      bgColor: 'bg-purple-500',
    },
    {
      id: 'batches',
      title: 'Batches / Sections',
      description: 'Total Batches: 4',
      icon: <MdGroups className="text-2xl" />,
      bgColor: 'bg-yellow-500',
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Academics Overview
        </h1>
        <p className="text-gray-600 text-lg">
          A summary of all active academic elements including courses, sessions, batches, and subjects.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {academicCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.route)}
            className=" rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </div>
                
                {/* Arrow Icon */}
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                  <MdArrowForward className="text-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className=" rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdGroups className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className=" rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MdTabletMac className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className=" rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faculty Members</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MdMenuBook className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className=" rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Session</p>
                <p className="text-lg font-semibold text-gray-900">2024-25</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MdCalendarToday className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
