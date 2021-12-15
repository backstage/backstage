---
'@backstage/app-defaults': patch
'@backstage/core-app-api': patch
'@backstage/core-plugin-api': patch
---

- Remove deprecation configuration option `theme` from `AppTheme` of the `AppThemeApi`
- Removed reference to `theme` in the `app-defaults` default `AppTheme`
- Removed logic in `AppThemeProvider` that creates `ThemeProvider` from `appTheme.theme`
