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
    const saved = localStorage.getItem('theme');

    if (saved === null) {
      // First visit → system preference
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Handle both "true"/"false" (JSON) and possible legacy "dark"/"light" strings
    if (saved === 'dark' || saved === 'true') {
      return true;
    }
    if (saved === 'light' || saved === 'false') {
      return false;
    }

    // Fallback (corrupted value)
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Always save as boolean → consistent JSON
    localStorage.setItem('theme', JSON.stringify(isDarkMode));

    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#111827' : '#ffffff');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const setLightMode = () => setIsDarkMode(false);
  const setDarkMode   = () => setIsDarkMode(true);

  const themeColors = {
    light: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#111827',
      textSecondary: '#374151',
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
      text: '#f9fafb',
      textSecondary: '#d1d5db',
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
      // ... other component overrides remain the same
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