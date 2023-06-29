---
'@backstage/theme': patch
---

Overwritting `PaletteOptions` & `ThemeOptions` type to allow usage of `createTheme` from `'@backstage/theme'` as well as `@material-ui/core/styles` with the same type. Additionally replacing default `CSSBaseline` wiht v4 instead of v5 for better backwards compatibilty for now.
