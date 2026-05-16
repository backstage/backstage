---
'@backstage/plugin-user-settings': patch
---

Prioritize i18n translation over `theme.title` for built-in light/dark theme names in `UserSettingsThemeToggle`, so that translation overrides are no longer silently ignored.
