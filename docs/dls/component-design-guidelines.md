---
id: design
title: Design
description: Documentation on Design
---

Be it a new component contribution, or plugin specific components, you'll want
to follow these guidelines, we'll cover the 3 main subjects that define the
general look and feel of your components, all of which build on top of the MUI
theme features:

- Layout
- Color palette
- Typography

## 🏗️ Layout

Layout refers to how you organize or stack content, whenever possible we want
to use Backstage's components (check the [Storybook][1] for a list and demo)
or MUI components (check the [MUI docs][2]).

If none of these fit your layout needs, then you can build one, however using
HTML+CSS directly is not recommended, it's better to use MUI layout components
to make your layout theme aware, meaning if someone changes the theme, your
layout would react to those changes without requiring updates to your code.

Specifically you want to look at these components that make use of the
`theme.spacing()` function for margins, paddings and positions, as well as
color palette and typography:

- [Container][3] mostly at page level
- [Box][4] like a div that can be customized a lot
- [Grid][5] & [Grid V2][6] (preferable V2) for flexible grid layouts
- [Stack][7] for vertical layouts (single column)
- [Paper][8] The base of a card, like it's background & padding on the borders
- [Card][9] Card with support for title, description, buttons, images...

## Color palette

Any component that needs a color to put in the styles should be using the
theme's color palette, most Backstage components and all MUI components should
use the theme's color palette by default, so unless you need explicit control
on the color of a component (say when the component was designed to use the
primary color but you want to use the secondary), then the easiest way to access
the color palette is with [`useTheme` hook](https://mui.com/material-ui/customization/theming/#accessing-the-theme-in-a-component).

It's not a very common use case to override a theme color in a MUI component
but let's say you have a Paper component that highlights it's content with a
different color for a side menu or something (usually you use the elevation,
but maybe the designer wanted a colorful app), you can use the theme like this:

```tsx
import { useTheme } from '@mui/material/styles';

export function Sidebar() {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.primary.main,
      }}
    >
      Some children here
    </Paper>
  );
}
```

Here is a link to the [Default Palette values][10] you can use, the tokens will be the same, what changes are the colors associated with those depending on
your app theme color palette.

## Typography

Most of the time the components from MUI will use the `<Typography />` component
which will use the theme's typography properties like font family, size, weight
and appropriate color from the palette for the context of that component, like
buttons that use white font color for contained buttons, or the respective color
passed on via props when not outlined for proper contrast (buttons in dark
theme adapt properly by using a dark font instead of white).

However for those cases where the parent component of the content doesn't handle
the text, like when the parent component is a layout one, you use typography
component instead of the HTML counterparts, usually used for titles and
paragraphs but it is valid for any type of text.

Check the [Typography docs][11] for information on how to install, use,
customize semantic elements and specially the recommendations about
accessibility.

[1]: http://backstage.io/storybook
[2]: https://mui.com/material-ui/getting-started/overview/
[3]: https://mui.com/material-ui/react-container/
[4]: https://mui.com/material-ui/react-box/
[5]: https://mui.com/material-ui/react-grid/
[6]: https://mui.com/material-ui/react-grid2/
[7]: https://mui.com/material-ui/react-stack/
[8]: https://mui.com/material-ui/react-paper/
[9]: https://mui.com/material-ui/react-card/
[10]: https://mui.com/material-ui/customization/palette/#default-values
[11]: https://mui.com/material-ui/react-typography
