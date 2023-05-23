---
'@backstage/app-defaults': minor
'@backstage/theme': minor
---

**MUI v5 Support:** Adding platform-wide support for MUI v5 allowing a transition phase for migrating central plugins & components over. We still support v4 instances & plugins by adding a

To allow the future support of plugins & components using MUI v5 you want to upgrade your `AppTheme`'s to using the `UnifiedThemeProvider`

```diff
     Provider: ({ children }) => (
-    <ThemeProvider theme={lightTheme}>
-      <CssBaseline>{children}</CssBaseline>
-    </ThemeProvider>
+    <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
     ),
```
