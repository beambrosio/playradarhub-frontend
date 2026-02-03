// src/components/ThemeToggle.js
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
