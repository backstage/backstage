---
id: app-custom-theme
title: Customize the look-and-feel of your App
description: Documentation on Customizing look and feel of the App
---

Backstage ships with a default theme with a light and dark mode variant. The
themes are provided as a part of the
[@backstage/theme](https://www.npmjs.com/package/@backstage/theme) package,
which also includes utilities for customizing the default theme, or creating
completely new themes.

## Creating a Custom Theme

The easiest way to create a new theme is to use the `createTheme` function
exported by the
[@backstage/theme](https://www.npmjs.com/package/@backstage/theme) package. You
can use it to override so basic parameters of the default theme such as the
color palette and font.

For example, you can create a new theme based on the default light theme like
this:

```ts
import { createTheme, lightTheme } from '@backstage/theme';

const myTheme = createTheme({
  palette: lightTheme.palette,
  fontFamily: 'Comic Sans MS',
});
```

If you want more control over the theme, and for example customize font sizes
and margins, you can use the lower-level `createThemeOverrides` function
exported by [@backstage/theme](https://www.npmjs.com/package/@backstage/theme)
in combination with
[createMuiTheme](https://material-ui.com/customization/theming/#createmuitheme-options-args-theme)
from [@material-ui/core](https://www.npmjs.com/package/@material-ui/core). See
the
[@backstage/theme source](https://github.com/backstage/backstage/tree/master/packages/theme/src)
and the implementation of the `createTheme` function for how this is done.

You can also create a theme from scratch that matches the `BackstageTheme` type
exported by [@backstage/theme](https://www.npmjs.com/package/@backstage/theme).
See the
[material-ui docs on theming](https://material-ui.com/customization/theming/)
for more information about how that can be done.

## Using your Custom Theme

To add a custom theme to your Backstage app, you pass it as configuration to
`createApp`.

For example, adding the theme that we created in the previous section can be
done like this:

```ts
import { createApp } from '@backstage/core';

const app = createApp({
  apis: ...,
  plugins: ...,
  themes: [{
    id: 'my-theme',
    title: 'My Custom Theme',
    variant: 'light',
    theme: myTheme,
  }]
})
```

Note that your list of custom themes overrides the default themes. If you still
want to use the default themes, they are exported as `lightTheme` and
`darkTheme` from
[@backstage/theme](https://www.npmjs.com/package/@backstage/theme).
