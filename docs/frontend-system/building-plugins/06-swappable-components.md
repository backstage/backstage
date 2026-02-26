---
id: swappable-components
title: Swappable components
sidebar_label: Swappable components
description: Configuring or overriding Swappable Components
---

# Swappable components

Swappable components are a feature of the frontend system that allow you to replace the implementations of components that are used in your Backstage app.
These Swappable Components are defined using `createSwappableComponent` and then can be exported from a plugins `-react` package in order to be used in both other plugins, and to be rebound to a new implementation by the Backstage Integrator.

## Creating a Swappable Component

In order to create a Swappable Component, you need to use the `createSwappableComponent` function from the `@backstage/frontend-plugin-api` package. You can supply a default implementation for the component, as well as a way to separate both the props of the external component and in the implementation of the component.

```tsx title="in @internal/plugin-example-react"
import { createSwappableComponent } from '@backstage/frontend-plugin-api';

export const ExampleSwappableComponent = createSwappableComponent({
  name: 'example',

  // This is a loader for loading the default implementation of the component when there's no overriden
  // implementation created with `SwappableComponentBlueprint`.
  // It can be sync like below, but is can also be async like `loader: () => import('./DefaultImplementation').then(m => m.DefaultImplementation)`.
  loader: () => (props: { name: string }) =>
    <div>Your name is {props.name}</div>,

  // This is an optional function that can be used to transform the props of the external component.
  // If it's not provided, the props of the external component will be passed through unchanged.
  // Typically this wouldn't be used and you don't need to define this initially,
  // this is a nice API to evolve the Swappable Component internal API without breaking usages of it in existing plugins.
  transformProps: (props: { lastName: string; firstName: string }) => ({
    name: `${props.firstName} ${props.lastName}`,
  }),
});
```

## Using a Swappable Component

Using a Swappable Component is just like using any other React Component. The return of `createSwappableComponent` can be rendered directly in your plugin, or any plugins that will be consuming your `-react` package.

```tsx title="in @internal/plugin-example"
import { ExampleSwappableComponent } from '@internal/plugin-example-react';

<ExampleSwappableComponent firstName="John" lastName="Doe" />;
```

## Overriding a Swappable Component

In order to override a Swappable Component, you need to create a `SwappableComponentBlueprint` and install it with the `app` plugin.
There are two different ways to add extensions to the `app` plugin, both are documented below in an example of overriding the `Progress` Swappable Component.

```tsx title="in packages/app/src/App.tsx"
import { Progress, createFrontendModule } from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { MyCustomProgress } from './CustomProgress';
import { createApp } from '@backstage/frontend-defaults';
import appPlugin from '@backstage/plugin-app';

const app = createApp({
  features: [
    // Using a module to provide the extenion to the app
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        SwappableComponentBlueprint.make({
          name: 'core-progress',
          params: defineParams =>
            defineParams({
              component: Progress,
              loader: () => MyCustomProgress,
            }),
        }),
      ],
    }),
    // Core components that already ship with the app plugin can be overriden using getExtension()
    appPlugin.withOverrides({
      extensions: [
        appPlugin.getExtension('component:app/core-progress').override({
          params: defineParams =>
            defineParams({
              component: Progress,
              loader: () => MyCustomProgress,
            }),
        }),
      ],
    }),
  ],
});
```

## Default Swappable Components

Currently there are only three different built-in Swappable Components that you can replace the implementations of, and these live in `@backstage/frontend-plugin-api`. They are as follows:

- `<Progress />
- `<ErrorDisplay />
- `<NotFoundErrorPage />

You can see more about these components at their [definition](https://github.com/backstage/backstage/blob/master/packages/frontend-plugin-api/src/components/DefaultSwappableComponents.tsx), and their default implementations are shipped inside the [`app-plugin`](https://github.com/backstage/backstage/blob/master/plugins/app/src/extensions/components.tsx).

## Implementations in tests

By default, if no `loader` is passed through to `createSwappableComponent` then there's a default fallback component which will be rendered, which is mainly helpful in tests. The default implementation for a Swappable Component without a `loader` is as follows:

```tsx
props => <div data-testid={swappableComponentRef.id} {...props} />;
```

Which means that you can use the `getByTestId` in tests to assert that these components have been rendered on the page.
