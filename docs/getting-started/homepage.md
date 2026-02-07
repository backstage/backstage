---
id: homepage
title: Backstage homepage - Setup and Customization
description: Documentation on setting up and customizing Backstage homepage
---

## Homepage

Having a good Backstage homepage can significantly improve the discoverability of the platform. You want your users to find all the things they need right from the homepage and never have to remember direct URLs in Backstage. The [Home plugin](https://github.com/backstage/backstage/tree/master/plugins/home) introduces a system for composing a homepage for Backstage in order to surface relevant info and provide convenient shortcuts for common tasks. It's designed with composability in mind with an open ecosystem that allows anyone to contribute with any component, to be included in any homepage.

For App Integrators, the system is designed to be composable to give total freedom in designing a Homepage that suits the needs of the organization. From the perspective of a Component Developer who wishes to contribute with building blocks to be included in Homepages, there's a convenient interface for bundling the different parts and exporting them with both error boundary and lazy loading handled under the surface.

At the end of this tutorial, you can expect:

- Your Backstage app to have a dedicated homepage instead of Software Catalog.
- Understand the composability of homepage and how to start customizing it for your own organization.

### Prerequisites

Before we begin, make sure

- You have created your own standalone Backstage app using [`@backstage/create-app`](./index.md#1-create-your-backstage-app) and not using a fork of the [backstage](https://github.com/backstage/backstage) repository.
- You do not have an existing homepage, and by default you are redirected to Software Catalog when you open Backstage.

Now, let's get started by installing the home plugin and creating a simple homepage for your Backstage app.

## Setup Methods

There are two ways to set up the home plugin, depending on which frontend system your Backstage app uses:

1. **New Frontend System (Recommended)** - For apps using the new plugin system with extensions and blueprints
2. **Legacy Frontend System** - For existing apps using the legacy plugin architecture

### New Frontend System Setup

If your Backstage app uses the [new frontend system](../frontend-system/index.md), follow these steps:

#### 1. Install the plugin

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-home
```

#### 2. Add the plugin to your app configuration

Update your `packages/app/src/app.tsx` to include the home plugin:

```tsx title="packages/app/src/app.tsx"
import homePlugin from '@backstage/plugin-home/alpha';

const app = createApp({
  features: [
    // ... other plugins
    homePlugin,
  ],
});
```

#### 3. Configure the homepage as your root route

By default, the homepage will be available at `/home`. To make it your app's landing page at `/`, add this configuration to your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:home:
        config:
          path: /
```

The plugin will automatically add a "Home" navigation item to your sidebar and provide a basic homepage layout.

#### 4. Optional: Enable visit tracking

Visit tracking is an optional feature that allows users to see their recently visited and most visited pages on the homepage. This feature is **disabled by default** to give you control over what data is collected and stored.

Visit tracking requires a storage implementation to persist user data:

- **With UserSettings storage** (recommended): If you have the [UserSettings plugin](https://backstage.io/docs/features/software-catalog/external-integrations/#user-settings) configured with persistent storage, visit data will be stored there and synchronized across devices.
- **Fallback to local storage**: If no persistent storage is available, the plugin will automatically fall back to browser local storage, which stores data locally per device.

To enable visit tracking, add this configuration to your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - api:home/visits: true
    - app-root-element:home/visit-listener: true
```

#### 5. Customizing your homepage

The New Frontend System provides powerful customization options:

**Custom Homepage Layouts**: Use the `HomePageLayoutBlueprint` from `@backstage/plugin-home-react/alpha` to create custom homepage layouts with your own design and widget arrangements. A layout receives the installed widgets and is responsible for rendering them. If no custom layout is installed, the plugin provides a built-in default.

**Adding Homepage Widgets**: Register custom widgets using the `HomepageWidgetBlueprint` from the `@backstage/plugin-home-react/alpha` package.

For detailed instructions on creating custom layouts, registering widgets, and advanced configuration options, see the [Home plugin documentation](https://github.com/backstage/backstage/tree/master/plugins/home#readme).

### Legacy Frontend System Setup

If your Backstage app uses the legacy frontend system, follow these steps:

#### 1. Install the plugin

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-home
```

#### 2. Create a new HomePage component

Inside your `packages/app` directory, create a new file where our new homepage component is going to live. Create `packages/app/src/components/home/HomePage.tsx` with the following initial code

```tsx
export const HomePage = () => (
  /* We will shortly compose a pretty homepage here. */
  <h1>Welcome to Backstage!</h1>
);
```

#### 3. Update router for the root `/` route

If you don't have a homepage already, most likely you have a redirect setup to use the Catalog homepage as a homepage.

Inside your `packages/app/src/App.tsx`, look for

```tsx title="packages/app/src/App.tsx"
const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" />
    {/* ... */}
  </FlatRoutes>
);
```

Let's replace the `<Navigate>` line and use the new component we created in the previous step as the new homepage.

```tsx title="packages/app/src/App.tsx"
/* highlight-add-start */
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
/* highlight-add-end */

const routes = (
  <FlatRoutes>
    {/* highlight-remove-next-line */}
    <Navigate key="/" to="catalog" />
    {/* highlight-add-start */}
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    {/* highlight-add-end */}
    {/* ... */}
  </FlatRoutes>
);
```

#### 4. Update sidebar items

Let's update the route for "Home" in the Backstage sidebar to point to the new homepage. We'll also add a Sidebar item to quickly open Catalog.

| Before                                                                            | After                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ![Sidebar without Catalog](../assets/getting-started/sidebar-without-catalog.png) | ![Sidebar with Catalog](../assets/getting-started/sidebar-with-catalog.png) |

The code for the Backstage sidebar is most likely inside your [`packages/app/src/components/Root/Root.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/Root/Root.tsx).

Let's make the following changes

```tsx title="packages/app/src/components/Root/Root.tsx"
/* highlight-add-next-line */
import CategoryIcon from '@material-ui/icons/Category';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      {/* ... */}
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        {/* highlight-remove-next-line */}
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        {/* highlight-add-start */}
        <SidebarItem icon={HomeIcon} to="/" text="Home" />
        <SidebarItem icon={CategoryIcon} to="catalog" text="Catalog" />
        {/* highlight-add-end */}
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={LayersIcon} to="explore" text="Explore" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        {/* End global nav */}
        <SidebarDivider />
        {/* ... */}
      </SidebarGroup>
    </Sidebar>
  </SidebarPage>
);
```

That's it! You should now have _(although slightly boring)_ a homepage!

<!-- todo: Needs zoomable plugin -->

![Screenshot of a blank homepage](../assets/getting-started/simple-homepage.png)

In the next steps, we will make it interesting and useful!

### Use the default template

There is a default homepage template ([storybook link](https://backstage.io/storybook/?path=/story/plugins-home-templates--default-template)) which we will use to set up our homepage. Checkout the [blog post announcement](https://backstage.io/blog/2022/01/25/backstage-homepage-templates) about the Backstage homepage templates for more information.

<!-- TODO for later: detailed instructions for using one of these templates. -->

### Composing your homepage

Composing a homepage is no different from creating a regular React Component,
i.e. the App Integrator is free to include whatever content they like. However,
there are components developed with the homepage in mind. If you are looking
for components to use when composing your homepage, you can take a look at the
[collection of Homepage components](https://backstage.io/storybook?path=/story/plugins-home-components)
in storybook. If you don't find a component that suits your needs but want to
contribute, check the
[Contributing documentation](https://github.com/backstage/backstage/blob/master/plugins/home/README.md#contributing).

> If you want to use one of the available homepage templates you can find the
> [templates](https://backstage.io/storybook/?path=/story/plugins-home-templates)
> in the storybook under the "Home" plugin. And if you would like to contribute
> a template, please see the
> [Contributing documentation](https://github.com/backstage/backstage/blob/master/plugins/home/README.md#contributing)

```tsx
import Grid from '@material-ui/core/Grid';
import { HomePageCompanyLogo } from '@backstage/plugin-home';

export const HomePage = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <HomePageCompanyLogo />
    </Grid>
  </Grid>
);
```
