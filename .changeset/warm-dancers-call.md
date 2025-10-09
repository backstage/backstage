---
'@backstage/theme': minor
---

**BREAKING**: Removed noCssBaseline prop in UnifiedThemeProvider. If your Backstage instance looks broken after this update, there's a high chance that you forgot to add our new Backstage UI global CSS. To do that, please add @backstage/ui/css/styles.css at the root of your application.
