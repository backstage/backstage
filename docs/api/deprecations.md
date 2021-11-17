---
id: deprecations
title: Deprecations
description: A list of active and past deprecations
---

## Introduction

This page contains extended documentation for some of the deprecations in
various parts of Backstage. It is not an exhaustive list as most deprecation
only come in the form of a changelog notice and a console warning. The
deprecations listed here are the ones that need a bit more guidance than what
fits in a console message.

### App Theme

`Released 2021-11-12 in @backstage/core-plugin-api v0.1.13`

In order to provide more flexibility in what types of themes can be used and how
they are applied, the `theme` property on the `AppTheme` type is being
deprecated and replaced by a `Provider` property instead. The `Provider`
property is a React component that will be mounted at the root of the app
whenever that theme is active. This also removes the tight connection to MUI and
opens up for other type of themes, and removes the hardcoded usage of
`<CssBaseline>`.

To migrate an existing theme, remove the `theme` property and move it over to a
new `Provider` component, using `ThemeProvider` from MUI to provide the new
theme, along with `<CssBaseline>`. For example a theme that currently looks like
this:

```tsx
const darkTheme = {
  id: 'dark',
  title: 'Dark Theme',
  variant: 'dark',
  icon: <DarkIcon />,
  theme: darkTheme,
};
```

Would be migrated to the following:

```tsx
const darkTheme = {
  id: 'dark',
  title: 'Dark Theme',
  variant: 'dark',
  icon: <DarkIcon />,
  Provider: ({ children }) => (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};
```
