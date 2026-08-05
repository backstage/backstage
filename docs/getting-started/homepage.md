---
id: homepage
title: Backstage homepage - Setup and Customization
description: Documentation on setting up and customizing Backstage homepage
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./homepage--old.md)
instead.
::::

## Homepage

The [Home plugin](https://github.com/backstage/backstage/tree/master/plugins/home)
gives your Backstage app a homepage where users can find what they need without
memorizing URLs. It ships with a drag-and-drop grid layout and a set of built-in
widgets. Users can add, remove, rearrange, and resize widgets, and their layout
is saved per user.

This guide covers:

- Installing the home plugin and making it your landing page.
- What widgets are available and how to configure them.
- How to create your own widgets and layouts.

### Prerequisites

Before you begin, make sure:

- You have created your own standalone Backstage app using
  [`@backstage/create-app`](./index.md#creating-and-running-a-backstage-application)
  and not using a fork of the
  [backstage](https://github.com/backstage/backstage) repository.
- You do not have an existing homepage, and by default you are redirected to the
  Software Catalog when you open Backstage.

## Setup

### 1. Install the plugin

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-home
```

Once installed, the plugin is available in your app through default feature
discovery. See
[installing plugins](../frontend-system/building-apps/05-installing-plugins.md)
for alternative installation methods.

### 2. Configure the homepage as your root route

The homepage lives at `/home` by default. To make it your landing page at `/`,
add this to your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:home:
        config:
          path: /
```

The plugin adds a "Home" navigation item to your sidebar automatically.

### 3. Enable visit tracking (optional)

Visit tracking records which pages users navigate to. The Most Visited and
Recently Visited widgets use this data. It is **disabled by default**.

When enabled, visit data is stored in one of two places:

- UserSettings storage (recommended) if you have the UserSettings plugin with
  persistent storage. Data syncs across devices.
- Browser local storage as a fallback if no persistent storage is available.

To enable it, add these extensions to your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - api:home/visits: true
    - app-root-element:home/visit-listener: true
```

## Available widgets

The following widgets are available out of the box and appear in the
**Add Widget** dialog when editing the homepage.

### Home plugin widgets

These widgets come from `@backstage/plugin-home`:

| Widget           | Extension ID                             | Description                                                        |
| :--------------- | :--------------------------------------- | :----------------------------------------------------------------- |
| Starred Entities | `home-page-widget:home/starred-entities` | Shows entities you have starred in the catalog.                    |
| Toolkit          | `home-page-widget:home/toolkit`          | A collection of configurable links and tools.                      |
| World Clocks     | `home-page-widget:home/world-clock`      | Displays clocks for configured time zones.                         |
| Most Visited     | `home-page-widget:home/top-visited`      | Shows your most frequently visited pages. Requires visit tracking. |
| Recently Visited | `home-page-widget:home/recently-visited` | Shows pages you have recently visited. Requires visit tracking.    |
| Random Joke      | `home-page-widget:home/random-joke`      | Shows a random programming joke.                                   |

### Search plugin widget

This widget comes from `@backstage/plugin-search`:

| Widget     | Extension ID                         | Description                                               |
| :--------- | :----------------------------------- | :-------------------------------------------------------- |
| Search Bar | `home-page-widget:search/search-bar` | A search bar that navigates to the search page on submit. |

:::note
The search bar widget requires `@backstage/plugin-search` to be installed.
:::

### Community widgets

The [Backstage community-plugins repository](https://github.com/backstage/community-plugins)
hosts additional plugins, some of which provide homepage widgets. Any plugin can
contribute widgets to the homepage by using the `HomePageWidgetBlueprint` from
`@backstage/plugin-home-react/alpha`.

## Configuring widgets

Some widgets accept configuration through `app-config.yaml`. Target a widget
using its extension ID.

### Toolkit

The Toolkit widget shows a grid of links. You can configure the links and their
icons:

```yaml title="app-config.yaml"
app:
  extensions:
    - home-page-widget:home/toolkit:
        config:
          tools:
            - url: https://backstage.io/docs
              label: Docs
              icon: docs
            - url: https://github.com/backstage/backstage
              label: GitHub
              icon: github
            - url: https://backstage.io/plugins
              label: Plugins Directory
              icon: kind:component
```

The `icon` field resolves through the app's icon API. You can use any registered
icon, including `kind:` prefixed icons for catalog entity kinds.

### World Clocks

Configure which time zones to display and the time format:

```yaml title="app-config.yaml"
app:
  extensions:
    - home-page-widget:home/world-clock:
        config:
          customTimeFormat:
            hour12: false
          clockConfigs:
            - label: NYC
              timeZone: America/New_York
            - label: UTC
              timeZone: UTC
            - label: STO
              timeZone: Europe/Stockholm
            - label: TYO
              timeZone: Asia/Tokyo
```

### Disabling a widget

To hide a widget from the **Add Widget** dialog, set it to `false`:

```yaml title="app-config.yaml"
app:
  extensions:
    - home-page-widget:home/random-joke: false
```

## Configuring the default layout

The `defaultConfig` option on `page:home` defines the grid layout that users see
before they have customized anything. Each entry places a widget at a specific
position and size in the grid:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:home:
        config:
          path: /
          defaultConfig:
            - component: HomePageSearchBar
              column: 0
              row: 0
              width: 12
              height: 2
              deletable: false
            - component: HomePageStarredEntities
              column: 0
              row: 2
              width: 4
              height: 4
            - component: HomePageToolkit
              column: 4
              row: 2
              width: 4
              height: 3
            - component: HomePageWorldClock
              column: 8
              row: 2
              width: 4
              height: 3
```

Each item in `defaultConfig` accepts these properties:

| Property    | Type    | Description                                                            |
| :---------- | :------ | :--------------------------------------------------------------------- |
| `component` | string  | The widget's component name (the `name` parameter from the blueprint). |
| `column`    | number  | The column position in the grid (0-based).                             |
| `row`       | number  | The row position in the grid (0-based).                                |
| `width`     | number  | The width in grid columns. The default grid has 12 columns.            |
| `height`    | number  | The height in grid rows.                                               |
| `movable`   | boolean | Whether the user can move the widget. Defaults to `true`.              |
| `deletable` | boolean | Whether the user can remove the widget. Defaults to `true`.            |
| `resizable` | boolean | Whether the user can resize the widget. Defaults to `true`.            |

:::tip
In edit mode, each widget displays its column, row, width, and height values.
Use these to figure out the right numbers for your `defaultConfig`.
:::

## Creating custom widgets

You can add your own widgets using the `HomePageWidgetBlueprint` from
`@backstage/plugin-home-react/alpha`. Define the widget, wrap it in a frontend
module, and register it in your app.

### A basic widget

```ts title="packages/app/src/modules/home/homeModule.tsx"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';

const myWidget = HomePageWidgetBlueprint.make({
  name: 'my-widget',
  params: {
    name: 'MyWidget',
    title: 'My Custom Widget',
    description: 'A short description shown in the Add Widget dialog',
    components: () =>
      import('./MyWidgetComponent').then(m => ({
        Content: m.Content,
      })),
  },
});

export const homeModule = createFrontendModule({
  pluginId: 'home',
  extensions: [myWidget],
});
```

Then register the module in your app:

```ts title="packages/app/src/App.tsx"
import { homeModule } from './modules/home';

export default createApp({
  features: [homeModule],
});
```

### Widget with layout constraints

Set minimum and maximum dimensions so the widget does not get too small or too
large:

```ts
const myWidget = HomePageWidgetBlueprint.make({
  name: 'my-widget',
  params: {
    name: 'MyWidget',
    title: 'My Custom Widget',
    description: 'A widget with size constraints',
    components: () =>
      import('./MyWidgetComponent').then(m => ({
        Content: m.Content,
      })),
    layout: {
      height: { minRows: 4 },
      width: { minColumns: 3 },
    },
  },
});
```

### Widget with user settings

Widgets can expose per-user settings. The settings schema follows
[react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/)
conventions:

```ts
const myWidget = HomePageWidgetBlueprint.make({
  name: 'my-widget',
  params: {
    name: 'MyWidget',
    title: 'My Custom Widget',
    description: 'A widget with user-configurable settings',
    components: () =>
      import('./MyWidgetComponent').then(m => ({
        Content: m.Content,
        Settings: m.Settings,
      })),
    settings: {
      schema: {
        title: 'Widget Settings',
        type: 'object',
        properties: {
          color: {
            title: 'Color',
            type: 'string',
            default: 'blue',
            enum: ['blue', 'red', 'green'],
          },
        },
      },
    },
  },
});
```

## Custom homepage layouts

If the default grid does not fit your needs, you can replace it entirely. Use
the `HomePageLayoutBlueprint` from `@backstage/plugin-home-react/alpha` to
create a layout component that receives the installed widgets and renders them
however you want.

```ts title="packages/app/src/modules/home/homeModule.tsx"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import {
  HomePageLayoutBlueprint,
  type HomePageLayoutProps,
} from '@backstage/plugin-home-react/alpha';
import { CustomHomepageGrid } from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import { Fragment } from 'react';

const myLayout = HomePageLayoutBlueprint.make({
  params: {
    loader: async () =>
      function MyHomePageLayout({ widgets }: HomePageLayoutProps) {
        return (
          <Page themeId="home">
            <Header title="Welcome" />
            <Content>
              <CustomHomepageGrid>
                {widgets.map((widget, index) => (
                  <Fragment key={widget.name ?? index}>
                    {widget.component}
                  </Fragment>
                ))}
              </CustomHomepageGrid>
            </Content>
          </Page>
        );
      },
  },
});

export const homeModule = createFrontendModule({
  pluginId: 'home',
  extensions: [myLayout],
});
```

When no custom layout is installed, the plugin falls back to a built-in default
that renders widgets inside `CustomHomepageGrid`.

### Preventing duplicate widgets

By default, users can add multiple instances of the same widget. If you are
using a custom layout with `CustomHomepageGrid`, you can restrict each widget
to a single instance by passing the `preventDuplicateWidgets` prop. This option
requires a custom layout. It is not exposed as an app-config setting.

```tsx
<CustomHomepageGrid preventDuplicateWidgets>
  {widgets.map((widget, index) => (
    <Fragment key={widget.name ?? index}>{widget.component}</Fragment>
  ))}
</CustomHomepageGrid>
```
