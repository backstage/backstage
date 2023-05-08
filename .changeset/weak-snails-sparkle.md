---
'@backstage/app-defaults': minor
'@backstage/test-utils': minor
'@backstage/theme': minor
'@backstage/plugin-techdocs-addons-test-utils': patch
'@backstage/cli': patch
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

**'@backstage/test-utils':** Test App Wrapper is using `UnifiedThemeProvider` for tests now.
**'@backstage/plugin-techdocs-addons-test-utils':** Fix tests by avoiding re-running theme on cleanup.
**'@backstage/cli':** Enforcing MUI v5 specific linting to minimize bundle size.
