---
id: migrate-to-mui5
title: Migrating from Material UI v4 to v5
description: Additionally resources to the Material UI migration guide specifically for Backstage
---

Before diving into the specific changes in Backstage, it may be helpful to take a look at the [Migration Guide provided by MUI](https://mui.com/material-ui/migration/migration-v4/). It breaks down the differences between v4, v5 and will make it easier to understand the impact on your Backstage instance & plugins.

To support Material UI v5 in addition to v4, we have introduced a `UnifiedThemeProvider`. This allows a gradual migration by running both versions in parallel. To use it, you need to update your app's `ThemeProvider` in `app/src/App.tsx` as follows:

```diff
     provider: ({ children }) => (
- <ThemeProvider theme={lightTheme}>.
- <CssBaseline>{children}</CssBaseline>.
- </ThemeProvider
+ <UnifiedThemeProvider theme={builtinThemes.light} children={children} />
     ),
```

It is worth noting that we are still using `@mui/styles` & `jss`. You may stumble upon documentation for migrating to `emotion` when using `makeStyles` or `withStyles`. It is not necessary to switch to `emotion` yet.

To comply with MUI recommendations, we are enforcing a new linting rules that favours standard imports over named imports and also restricting 3rd level imports as they are considered private ([Guide: Minimizing Bundle Size](https://mui.com/material-ui/guides/minimizing-bundle-size)).

For current knonw issues with the MUI v5 migration follow our [Milestone on GitHub](https://github.com/backstage/backstage/milestone/40). Please open a new issue if you run into different problems.

### Plugins

To migrate your plugin to MUI v5, you can build on the resources available.

1. Run the migration `codemod` for the path of the specific plugin: `npx @mui/codemod v5.0.0/preset-safe <path>`.
2. Manually fix the imports to match the new [linting rules](https://mui.com/material-ui/guides/minimizing-bundle-size). Take a look at possible `TODO:` items the `codemod` could not fix.
3. Removal of types & methods from `@backstage/theme` which are marked as `@deprecated`.

You can follow the [migration of the GraphiQL plugin](https://github.com/backstage/backstage/pull/17696) as an example plugin migration.
