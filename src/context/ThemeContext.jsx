import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    // Apply theme to document body
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.className = newTheme ? 'dark' : 'light';
  };

  const theme = {
    isDark,
    toggleTheme,
    bg: isDark ? 'bg-[#121417]' : 'bg-gray-50',
    cardBg: isDark ? 'bg-[#1a1c1e]' : 'bg-white',
    text: isDark ? 'text-white' : 'text-black',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-700',
    border: isDark ? 'border-gray-800' : 'border-gray-200'
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};