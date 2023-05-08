---
'@backstage/plugin-graphiql': minor
---

**BREAKING:** Upgrade GraphiQL Plugin from MUI v4 to v5. For this plugin to work with Material-UI v5 you have to update your App's ThemeProvider in `app/src/App.tsx` e.g. like the following:

```diff
     Provider: ({ children }) => (
-    <ThemeProvider theme={lightTheme}>
-      <CssBaseline>{children}</CssBaseline>
-    </ThemeProvider>
+    <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
     ),
```

Checkout the ["_Add support for Material-UI v5_" PR](https://github.com/backstage/backstage/pull/15484) for further information.
