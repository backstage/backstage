---
id: component-design-guidelines
title: Component Design Guidelines
description: Documentation on Design
---

Be it a new component contribution, or plugin specific components, you'll want
to follow these guidelines. We'll cover the three main subjects that define the
general look and feel of your components, all of which build on top of the
Material-UI theme features:

- Layout
- Color palette
- Typography

## 🏗️ Layout

Layout refers to how you organize or stack content. Whenever possible, we want
to use Backstage's components (check the [Storybook][1] for a list and demo)
first, and otherwise fall back to Material-UI components (check the [MUI docs][2]).

If none of these fit your layout needs, then you can build your own components.
However, using HTML+CSS directly is not recommended; it's better to use MUI
layout components to make your layout theme aware, meaning if someone changes
the theme, your layout would react to those changes without requiring updates
to your code.

Specifically you want to look at these components that make use of the
`theme.spacing()` function for margins, paddings and positions, as well as
color palette and typography:

- [Container][3] mostly at page level
- [Box][4] like a div that can be customized a lot
- [Grid][5] for flexible grid layouts
- [Paper][6] The base of a card, like it's background & padding on the borders
- [Card][7] Card with support for title, description, buttons, images...

## Color palette

If you're using an existing component and want to tweak the colors it uses in
general in the whole application, you can use a [Custom Theme][10] to override
specific styles for that component, that includes paddings, margins and colors.

However when making a component from scratch you'll need to reference the theme
as much as possible, make sure to use the theme's color palette. Most Backstage
components and all MUI components should use the theme's color palette by default,
so unless you need explicit control on the color of a component (say when the
component was designed to use the primary color but you want to use the
secondary color instead), then the easiest way to access the color palette is
to [Override the Component Styles][11] as suggested by Backstage.

It's not a very common use case to override a theme color in a MUI component
but let's say you have a custom Sidebar component with a Paper component that
highlights its content with a different color for a side menu or something
(usually you use the elevation, but maybe the designer wanted a colorful app).
You can use the theme like this:

```tsx
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  sidebarPaper: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export function Sidebar({ children }) {
  const { sidebarPaper } = useStyles();
  return <Paper className={sidebarPaper}>{children}</Paper>;
}
```

Here is a link to the [Default Palette values][8] you can use, the tokens will
be the same, what changes are the colors associated with those depending on your
app theme color palette, there's also a [Default Theme Explorer][12] to look
which tokens you can use as reference from the compiled theme.

## Typography

Most of the time the components from MUI will use the `<Typography />` component
which will use the theme's typography properties like font family, size, weight
and appropriate color from the palette for the context of that component. This applies for example to
buttons that use white font color for contained buttons, or the respective color
passed on via props when not outlined for proper contrast (buttons in dark
theme adapt properly by using a dark font instead of white).

However for those cases where the parent component of the content doesn't handle
the text, like when the parent component is a layout one, you use typography
component instead of the HTML counterparts, usually used for titles and
paragraphs but it is valid for any type of text.

Check the [Typography docs][9] for information on how to install, use,
customize semantic elements and specially the recommendations about
accessibility.

[1]: http://backstage.io/storybook
[2]: https://v4.mui.com/getting-started/supported-components/
[3]: https://v4.mui.com/components/container/
[4]: https://v4.mui.com/components/box/
[5]: https://v4.mui.com/components/grid/
[6]: https://v4.mui.com/components/paper/
[7]: https://v4.mui.com/components/cards/
[8]: https://v4.mui.com/customization/palette/#default-values
[9]: https://v4.mui.com/customization/typography/
[10]: https://backstage.io/docs/getting-started/app-custom-theme
[11]: https://backstage.io/docs/getting-started/app-custom-theme#overriding-backstage-and-material-ui-components-styles
[12]: https://v4.mui.com/customization/default-theme/#explore
