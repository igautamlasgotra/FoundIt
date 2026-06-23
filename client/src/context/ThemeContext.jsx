import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

// Warm light/dark theme, persisted to localStorage and applied via the
// data-theme attribute that tokens.css keys off (brief §8: dark mode persisted).
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('foundit_theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('foundit_theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
