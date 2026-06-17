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

Having a good Backstage homepage can significantly improve the discoverability of the platform. You want your users to find all the things they need right from the homepage and never have to remember direct URLs in Backstage. The [Home plugin](https://github.com/backstage/backstage/tree/master/plugins/home) introduces a system for composing a homepage for Backstage in order to surface relevant info and provide convenient shortcuts for common tasks. It's designed with composability in mind with an open ecosystem that allows anyone to contribute with any component, to be included in any homepage.

For App Integrators, the system is designed to be composable to give total freedom in designing a Homepage that suits the needs of the organization. From the perspective of a Component Developer who wishes to contribute with building blocks to be included in Homepages, there's a convenient interface for bundling the different parts and exporting them with both error boundary and lazy loading handled under the surface.

At the end of this tutorial, you can expect:

- Your Backstage app to have a dedicated homepage instead of Software Catalog.
- Understand the composability of homepage and how to start customizing it for your own organization.

### Prerequisites

Before we begin, make sure

- You have created your own standalone Backstage app using [`@backstage/create-app`](./index.md#creating-and-running-a-backstage-application) and not using a fork of the [backstage](https://github.com/backstage/backstage) repository.
- You do not have an existing homepage, and by default you are redirected to Software Catalog when you open Backstage.

Now, let's get started by installing the home plugin and creating a simple homepage for your Backstage app.

## Setup

### 1. Install the plugin

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-home
```

Once installed, the plugin is automatically available in your app through the default feature discovery. For more details and alternative installation methods, see [installing plugins](../frontend-system/building-apps/05-installing-plugins.md).

### 2. Configure the homepage as your root route

By default, the homepage will be available at `/home`. To make it your app's landing page at `/`, add this configuration to your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:home:
        config:
          path: /
```

The plugin will automatically add a "Home" navigation item to your sidebar and provide a basic homepage layout.

### 3. Optional: Enable visit tracking

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

### 4. Customizing your homepage

The home plugin provides powerful customization options:

**Custom Homepage Layouts**: Use the `HomePageLayoutBlueprint` from `@backstage/plugin-home-react/alpha` to create custom homepage layouts with your own design and widget arrangements. A layout receives the installed widgets and is responsible for rendering them. If no custom layout is installed, the plugin provides a built-in default.

**Adding Homepage Widgets**: Register custom widgets using the `HomePageWidgetBlueprint` from the `@backstage/plugin-home-react/alpha` package.

For detailed instructions on creating custom layouts, registering widgets, and advanced configuration options, see the [Home plugin documentation](https://github.com/backstage/backstage/tree/master/plugins/home#readme).
