import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext();

export { ThemeContext };

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference or default to light mode
    const saved = localStorage.getItem('theme');
    if (saved) {
      return JSON.parse(saved);
    }
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#111827' : '#ffffff');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setLightMode = () => {
    setIsDarkMode(false);
  };

  const setDarkMode = () => {
    setIsDarkMode(true);
  };

  // Enhanced theme colors
  const themeColors = {
    light: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#111827',        // Dark text for light background
      textSecondary: '#374151', // Dark secondary text
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',        // Light text for dark background
      textSecondary: '#d1d5db', // Light secondary text
      border: '#4b5563',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  };

  const currentTheme = isDarkMode ? themeColors.dark : themeColors.light;

  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme.primary,
      colorSuccess: currentTheme.success,
      colorWarning: currentTheme.warning,
      colorError: currentTheme.error,
      colorBgContainer: currentTheme.background,
      colorBgElevated: currentTheme.surface,
      colorText: currentTheme.text,
      colorTextSecondary: currentTheme.textSecondary,
      colorBorder: currentTheme.border,
      borderRadius: 8,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 14,
      fontSizeHeading1: 32,
      fontSizeHeading2: 24,
      fontSizeHeading3: 20,
    },
    components: {
      Layout: {
        bodyBg: currentTheme.background,
        headerBg: currentTheme.background,
        siderBg: currentTheme.background,
        footerBg: currentTheme.background,
      },
      Card: {
        colorBgContainer: currentTheme.background,
        colorBorderSecondary: currentTheme.border,
      },
      Menu: {
        colorBgContainer: currentTheme.background,
        colorText: currentTheme.text,
        colorTextSecondary: currentTheme.textSecondary,
        colorItemBg: 'transparent',
        colorItemBgHover: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
        colorItemBgSelected: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
        colorItemTextSelected: currentTheme.primary,
      },
      Button: {
        colorBgContainer: currentTheme.background,
        colorBorder: currentTheme.border,
        colorText: currentTheme.text,
      },
      Input: {
        colorBgContainer: currentTheme.background,
        colorBorder: currentTheme.border,
        colorText: currentTheme.text,
      },
      Select: {
        colorBgContainer: currentTheme.background,
        colorBorder: currentTheme.border,
        colorText: currentTheme.text,
      },
      Table: {
        colorBgContainer: currentTheme.background,
        colorText: currentTheme.text,
        colorTextHeading: currentTheme.text,
        colorBorderSecondary: currentTheme.border,
      },
      Modal: {
        colorBgElevated: currentTheme.background,
        colorText: currentTheme.text,
        colorTextHeading: currentTheme.text,
      },
    },
  };

  const themeValue = {
    isDarkMode,
    toggleTheme,
    setLightMode,
    setDarkMode,
    colors: currentTheme,
    mode: isDarkMode ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
