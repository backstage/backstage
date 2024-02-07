---
id: migrate-to-mui5
title: Migrating from Material UI v4 to v5
description: Additional resources for the Material UI v5 migration guide specifically for Backstage
---

Backstage supports developing new plugins or components using Material UI v5. At the same time, large parts of the application as well as existing plugins will still be using Material UI v4. To support Material UI v4 and v5 at the same time, we have introduced a new concept called the `UnifiedTheme`. The goal of the `UnifiedTheme` is to allow gradual migration by running both versions in parallel, applying theme options similarly & supporting potential future versions of Material UI.

By default, the `UnifiedThemeProvider` is already used. If you add a custom theme in your `createApp` function, you would need to replace the Material UI `ThemeProvider` with the `UnifiedThemeProvider`:

```diff ts
+ import import {
+   UnifiedThemeProvider,
+   themes as builtinThemes,
+ } from '@backstage/theme';

  const app = createApp({
    // ...
    themes: [
      {
        // ...
        Provider: ({ children }) => (
-         <ThemeProvider theme={lightTheme}>.
-           <CssBaseline>{children}</CssBaseline>.
-         </ThemeProvider
+         <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
        ),
      }
    ]
  });
```

Before making specific changes to your Backstage instance, it might be helpful to take a look at the [Migration Guide provided by Material UI](https://mui.com/material-ui/migration/migration-v4/) first. It breaks down the differences between v4 and v5, and will make it easier to understand the impact on your Backstage instance & plugins.

It is worth noting that we are still using `@mui/styles` & `jss`. You may stumble upon documentation for migrating to `emotion` when using `makeStyles` or `withStyles`. It is not necessary to switch to `emotion`.

Important to keep in mind is that Material UI v5 is meant to be used with React Version 17 or higher. This means if you intend to use the Material UI v5 components in your plugins, you have to enforce React Version to be at least 17 for these plugins:

```json
...
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0",
    "react-router-dom": "6.0.0-beta.0 || ^6.3.0"
  },
...
```

To comply with Material UI recommendations, we are enforcing a new linting rule that favors standard imports over named imports and also restricts 3rd-level imports as they are considered private ([Guide: Minimizing Bundle Size](https://mui.com/material-ui/guides/minimizing-bundle-size)).

There are `core-components` as well as components exported from Backstage `*-react` plugins written in Material UI v4, which expect Material UI components as props. In these cases you will still be forced to use Material UI v4.

For current known issues with the Material UI v5 migration, follow our [Milestone on GitHub](https://github.com/backstage/backstage/milestone/40). Please open a new issue if you run into different problems.

### Plugins

To migrate your plugin to Material UI v5, you can build on the resources available.

1. Manually fix the imports from named to default imports to match the new [linting rules for minimizing bundle size](https://mui.com/material-ui/guides/minimizing-bundle-size). Note: you can use the [new `@backstage/no-top-level-material-ui-4-imports` ESLint](https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-top-level-material-ui-4-imports.md) rule to help with this.
2. Run the migration `codemod` for the path of the specific plugin: `npx @mui/codemod v5.0.0/preset-safe plugins/<path>`.
3. Take a look at possible `TODO:` items the `codemod` could not fix.
4. Remove types & methods from `@backstage/theme` which are marked as `@deprecated`.
5. Ensure you are using `"react": "^17.0.0"` (or newer) as a peer dependency

You can follow the [migration of the GraphiQL plugin](https://github.com/backstage/backstage/pull/17696) as an example of a plugin migration.
