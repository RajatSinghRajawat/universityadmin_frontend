# Analytics Dashboard

A modern, responsive analytics dashboard built with React, Ant Design, and Tailwind CSS.

## Features

### 🎨 Modern UI Design
- Clean, professional interface inspired by modern analytics platforms
- Consistent design language with smooth transitions and animations
- Responsive layout that works on all device sizes

### 🌗 Dark/Light Mode
- Seamless theme switching with persistent user preference
- Optimized color schemes for both light and dark modes
- Automatic system theme detection

### 📊 Analytics Components
- **Stats Cards**: Key metrics with trend indicators and visual icons
- **Interactive Charts**: Line, area, bar, and pie charts using Recharts
- **Data Tables**: Advanced tables with filtering, sorting, and search
- **Activity Timeline**: Real-time activity feed with status indicators

### 🎯 Key Metrics Displayed
- Total Students, Faculty, Courses, and Revenue
- Attendance tracking with progress indicators
- Department distribution analysis
- Subject performance metrics
- System health monitoring

### 📱 Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible sidebar for better mobile experience
- Adaptive grid layouts for different screen sizes
- Touch-friendly interface elements

## Components Structure

```
src/components/Dashboard/
├── AnalyticsDashboard.jsx          # Main dashboard layout
├── components/
│   ├── StatsCards.jsx              # Statistics cards component
│   ├── ChartsSection.jsx           # Charts and graphs
│   ├── StudentTable.jsx            # Student data table
│   └── RecentActivity.jsx          # Activity timeline
└── README.md
```

## Usage

### Basic Implementation
```jsx
import { ThemeProvider } from './contexts/ThemeContext';
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard';

function App() {
  return (
    <ThemeProvider>
      <AnalyticsDashboard />
    </ThemeProvider>
  );
}
```

### Theme Context
```jsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

## Customization

### Colors and Themes
Customize the theme in `src/contexts/ThemeContext.jsx`:
```jsx
const antdTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    // Add more customizations
  }
};
```

### Adding New Charts
1. Create your chart component in `components/`
2. Import and use in `ChartsSection.jsx`
3. Use Recharts components for consistency

### Styling
- Use Tailwind CSS classes for layout and spacing
- Ant Design components handle most styling automatically
- Custom CSS is in `src/index.css` for fine-tuning

## Technologies Used

- **React 19** - Modern React with latest features
- **Ant Design 5** - Enterprise-class UI components
- **Tailwind CSS 4** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **React Context** - State management for themes

## Performance Features

- Lazy loading for large datasets
- Virtualized tables for optimal performance
- Optimized re-renders with React best practices
- Efficient theme switching without page reload

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Real-time data updates with WebSocket
- [ ] Export functionality for charts and tables
- [ ] Advanced filtering and search capabilities
- [ ] Custom dashboard widget creation
- [ ] Multi-language support
- [ ] Advanced user permissions and roles
