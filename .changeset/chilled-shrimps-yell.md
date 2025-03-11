---
'@backstage/theme': minor
---

Added the baseline theme from `@backstage/canon` to `UnifiedThemeProvider`, in addition to the new `cssLinks` and `themeDataAttribute` props.

The intention of this change is to add fowards compatibility with `@backstage/canon` components and ensure that the existing theme and CSS baseline does not interfere with theming in MUI.
