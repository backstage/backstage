// Applies a stored light or dark theme choice before the app loads, so that
// the browser paints its default background in the right color scheme.
(function applyStoredColorScheme() {
  try {
    const theme = window.localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.style.colorScheme = theme;
    }
  } catch {
    // localStorage can be unavailable, for example when storage is blocked
  }
})();
