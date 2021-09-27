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
  defaultPageTheme: 'home',
});
```

If you want more control over the theme, and for example customize font sizes
and margins, you can use the lower-level `createThemeOverrides` function
exported by [@backstage/theme](https://www.npmjs.com/package/@backstage/theme)
in combination with
[createTheme](https://material-ui.com/customization/theming/#createmuitheme-options-args-theme)
from [@material-ui/core](https://www.npmjs.com/package/@material-ui/core). See
the "Overriding Backstage and Material UI css rules" section below.

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
import { createApp } from '@backstage/core-app-api';

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

## Example of a custom theme

```ts
const themeOptions = createThemeOptions({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: '#123456',
    },
    secondary: {
      main: '#123456',
    },
    error: {
      main: '#123456',
    },
    warning: {
      main: '#123456',
    },
    info: {
      main: '#123456',
    },
    success: {
      main: '#123456',
    },
    background: {
      default: '#123456',
      paper: '#123456',
    },
    banner: {
      info: '#123456',
      error: '#123456',
      text: '#123456',
      link: '#123456',
    },
    errorBackground: '#123456',
    warningBackground: '#123456',
    infoBackground: '#123456',
    navigation: {
      background: '#123456',
      indicator: '#123456',
      color: '#123456',
      selectedColor: '#123456',
    },
  },
  defaultPageTheme: 'home',
  fontFamily: 'Comic Sans',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme(['#123456', '#123456'], shapes.wave),
    documentation: genPageTheme(['#123456', '#123456'], shapes.wave2),
    tool: genPageTheme(['#123456', '#123456'], shapes.round),
    service: genPageTheme(['#123456', '#123456'], shapes.wave),
    website: genPageTheme(['#123456', '#123456'], shapes.wave),
    library: genPageTheme(['#123456', '#123456'], shapes.wave),
    other: genPageTheme(['#123456', '#123456'], shapes.wave),
    app: genPageTheme(['#123456', '#123456'], shapes.wave),
    apis: genPageTheme(['#123456', '#123456'], shapes.wave),
  },
});
```

## Overriding Backstage and Material UI components styles

When creating a custom theme you would be applying different values to
component's css rules that use the theme object. For example, a Backstage
component's styles might look like this:

```ts
const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    header: {
      padding: theme.spacing(3),
      boxShadow: '0 0 8px 3px rgba(20, 20, 20, 0.3)',
      backgroundImage: theme.page.backgroundImage,
    },
  }),
  { name: 'BackstageHeader' },
);
```

Notice how the `padding` is getting its value from `theme.spacing`, that means
that setting a value for spacing in your custom theme would affect this
component padding property and the same goes for `backgroundImage` which uses
`theme.page.backgroundImage`. However, the `boxShadow` property doesn't
reference any value from the theme, that means that creating a custom theme
wouldn't be enough to alter the `box-shadow` property or to add css rules that
aren't already defined like a margin. For these cases you should also create an
override.

```ts
import { createApp } from '@backstage/core-app-api';
import { BackstageTheme, lightTheme } from '@backstage/theme';
/**
 * The `@backstage/core-components` package exposes this type that
 * contains all Backstage and `material-ui` components that can be
 * overridden along with the classes key those components use.
 */
import { BackstageOverrides } from '@backstage/core-components';

export const createCustomThemeOverrides = (
  theme: BackstageTheme,
): BackstageOverrides => {
  return {
    BackstageHeader: {
      header: {
        width: 'auto',
        margin: '20px',
        boxShadow: 'none',
        borderBottom: `4px solid ${theme.palette.primary.main}`,
      },
    },
  };
};

const app = createApp({
  apis: ...,
  plugins: ...,
  themes: [{
    id: 'my-theme',
    title: 'My Custom Theme',
    variant: 'light',
    theme: {
      ...lightTheme,
      overrides: {
        // These are the overrides that Backstage applies to `material-ui` components
        ...lightTheme.overrides,
        // These are your custom overrides, either to `material-ui` or Backstage components.
        ...createCustomThemeOverrides(lightTheme),
      },
    },
  }]
});
```

## Custom Logo

In addition to a custom theme, you can also customize the logo displayed at the
far top left of the site.

In your frontend app, locate `src/components/Root/` folder. You'll find two
components:

- `LogoFull.tsx` - A larger logo used when the Sidebar navigation is opened.
- `LogoIcon.tsx` - A smaller logo used when the sidebar navigation is closed.

To replace the images, you can simply replace the relevant code in those
components with raw SVG definitions.

You can also use another web image format such as PNG by importing it. To do
this, place your new image into a new subdirectory such as
`src/components/Root/logo/my-company-logo.png`, and then add this code:

```jsx
import MyCustomLogoFull from './logo/my-company-logo.png';

//...

const LogoFull = () => {
  return <img src={MyCustomLogoFull} />;
};
```
