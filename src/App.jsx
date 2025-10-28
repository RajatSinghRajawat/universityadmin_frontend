import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRouter from './components/Router/AppRouter';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;