// Auto-generated theme switcher utility

export const availableThemes = {
  default: '/styles.css',
  spotify: '/spotify-theme.css',
} as const;

export type ThemeName = keyof typeof availableThemes;

export function switchTheme(themeName: ThemeName) {
  // Remove existing theme links
  const existingLinks = document.querySelectorAll('link[data-theme-mode]');
  existingLinks.forEach(link => link.remove());

  // Add new theme link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = availableThemes[themeName];
  link.setAttribute('data-theme-mode', themeName);
  document.head.appendChild(link);
}

export function getCurrentTheme(): ThemeName {
  const existingLink = document.querySelector('link[data-theme-mode]');
  if (existingLink) {
    const href = existingLink.getAttribute('href');
    for (const [name, path] of Object.entries(availableThemes)) {
      if (path === href) return name as ThemeName;
    }
  }
  return 'default';
}
