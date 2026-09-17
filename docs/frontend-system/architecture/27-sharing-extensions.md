---
id: sharing-extensions
title: Sharing Extensions Across Multiple Locations
sidebar_label: Sharing Extensions
description: Using Utility APIs to share extensions across multiple locations in your app
---

Some plugins may need to provide extensibility that can be reused in multiple locations throughout the app. For example, in the pattern demonstrated on this page, a plugin can be made extensible by allowing widgets to be contributed that are then rendered on multiple pages. To achieve this, the recommended pattern is to use a Utility API that collects the extensions and makes them available throughout the plugin or the app.

## Overview

This pattern combines a Utility API with an extension blueprint to:

1. Define the extension data types and API interface
2. Provide a blueprint for creating extensions
3. Create a Utility API extension that collects extensions as input
4. Consume the extensions via the API

This approach provides a native integration with the frontend system, allowing to further rely on features like making the extensions configurable or have further extension points.

## Basic Pattern

The following example demonstrates this pattern using widgets that can be displayed on multiple pages. However, this pattern is flexible and can be adapted for many different scenarios where you need to:

- Share the same type of extension across different pages or views
- Allow third-party plugins to contribute extensions in a decoupled way
- Aggregate similar functionality from multiple sources in a consistent way

The core concepts remain the same regardless of what type of functionality you're sharing.

### 1. Define the Extension Data Types and API Interface

First, in your plugin's `-react` package (e.g., `backstage-plugin-foo-react`), define the widget types and API interface:

```tsx title="in backstage-plugin-foo-react"
import { createApiRef } from '@backstage/frontend-plugin-api';
import { ComponentType } from 'react';

export interface FooWidgetProps {
  title: string;
}

// Define what data each widget provides, prefer using lazy loading for large pieces of functionality like components
export interface FooWidget {
  title: string;
  size: 'small' | 'medium' | 'large';
  loader: () => Promise<ComponentType<FooWidgetProps>>;
}

// Define the API interface
export interface FooWidgetsApi {
  getWidgets(): FooWidget[];
}

// Create the API reference
export const fooWidgetsApiRef = createApiRef<FooWidgetsApi>({
  id: 'plugin.foo.widgets',
});
```

### 2. Provide a Blueprint for Creating Extensions

Next, also in your `-react` package (e.g., `backstage-plugin-foo-react`), create a blueprint that creates extensions. The blueprint creates an internal data reference and exposes it via the `dataRefs` property. This blueprint will be exported for other plugins to use:

```tsx title="in backstage-plugin-foo-react"
import {
  createExtensionBlueprint,
  createExtensionDataRef,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';

const fooWidgetDataRef = createExtensionDataRef<FooWidget>().with({
  id: 'foo.widget',
});

export const FooWidgetBlueprint = createExtensionBlueprint({
  kind: 'foo-widget',
  // Attach extensions created with this blueprint to the API extension that will be created in the next step
  attachTo: { id: 'api:foo/widgets', input: 'widgets' },
  output: [fooWidgetDataRef],
  *factory(params: FooWidget, { node }) {
    yield fooWidgetDataRef({
      title: params.title,
      size: params.size,
      loader: ExtensionBoundary.lazyComponent(node, params.loader),
    });
  },
  dataRefs: {
    widget: fooWidgetDataRef,
  },
});
```

### 3. Create a Utility API Extension that Collects Extensions

In your main plugin package (e.g., `backstage-plugin-foo`), create a Utility API extension that collects widgets as input. Note that this imports the blueprint's data reference via `FooWidgetBlueprint.dataRefs.widget`:

```tsx title="in backstage-plugin-foo"
import {
  ApiBlueprint,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  FooWidgetBlueprint,
  fooWidgetsApiRef,
} from 'backstage-plugin-foo-react';

export const FooWidgetsApiExtension = ApiBlueprint.makeWithOverrides({
  name: 'widgets',
  inputs: {
    widgets: createExtensionInput([FooWidgetBlueprint.dataRefs.widget]),
  },
  factory(originalFactory, { inputs }) {
    // Collect all widgets from the inputs and forward them to the API implementation
    const widgets = inputs.widgets.map(w =>
      w.get(FooWidgetBlueprint.dataRefs.widget),
    );

    return originalFactory(defineParams =>
      defineParams({
        api: fooWidgetsApiRef,
        deps: {},
        factory: () => ({
          getWidgets: () => widgets,
        }),
      }),
    );
  },
});
```

Other plugins can now import the blueprint from your `-react` package and create widget extensions that will be collected by the API:

```tsx title="in a consuming plugin"
import { FooWidgetBlueprint } from 'backstage-plugin-foo-react';

const barWidgetExtension = FooWidgetBlueprint.make({
  name: 'bar',
  params: {
    title: 'Bar Widget',
    size: 'small',
    loader: () => import('./components/BarWidget').then(m => m.BarWidget),
  },
});

const bazWidgetExtension = FooWidgetBlueprint.make({
  name: 'baz',
  params: {
    title: 'Baz Widget',
    size: 'medium',
    loader: () => import('./components/BazWidget').then(m => m.BazWidget),
  },
});
```

### 4. Consume the Extensions via the API

You can now consume the widgets using any of the available methods for consuming Utility APIs. For example, this is how you would access the widgets in a component:

```tsx title="in backstage-plugin-foo"
import { useApi } from '@backstage/frontend-plugin-api';
import { fooWidgetsApiRef } from 'backstage-plugin-foo-react';
import { Suspense, lazy } from 'react';

export function FooPageContent() {
  const widgetsApi = useApi(fooWidgetsApiRef);
  const widgets = widgetsApi.getWidgets();

  return; // load and render widgets ...
}
```

For more information on consuming Utility APIs, see the [Consuming Utility APIs](../utility-apis/03-consuming.md) page.
