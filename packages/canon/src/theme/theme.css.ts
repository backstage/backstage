import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    accent: '#1ed760',
    background: '#fff',
  },
  space: {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  font: {
    regular: "'Inter', sans-serif",
    monospace: "'Monospace', monospace",
    emoji:
      "'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
});
