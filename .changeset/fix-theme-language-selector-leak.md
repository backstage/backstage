---
'@backstage/core-app-api': patch
---

Fixed memory leak caused by duplicate `AppThemeSelector` instances and missing cleanup in `AppThemeSelector` and `AppLanguageSelector`. Added `dispose()` method to both selectors for proper resource cleanup.
