import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 group"
      title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative w-5 h-5">
        <Sun className={`w-5 h-5 text-yellow-500 absolute transition-all duration-300 ${
          theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-90 scale-0'
        }`} />
        <Moon className={`w-5 h-5 text-blue-400 absolute transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
        }`} />
      </div>
    </button>
  );
};

export default ThemeToggle;