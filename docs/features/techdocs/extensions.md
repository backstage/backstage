---
id: extensions
title: Using TechDocs Extensions
sidebar_label: Using TechDocs Extensions
description: How to use the built-in TechDocs extension points
---

TechDocs provides extension points for both the backend and frontend, allowing you to customize various aspects of the documentation experience.

# TechDocs Backend Extensions

The TechDocs backend plugin provides the following extension points:

- `techdocsPreparerExtensionPoint`
  - Register a custom docs [PreparerBase extension](https://backstage.io/docs/reference/plugin-techdocs-node.preparerbase/)
  - Ideal for when you want a custom type of docs created for a specific entity type
- `techdocsBuildsExtensionPoint`
  - Allows overriding the build phase Winston log transport (by default does not log to console)
  - Allows overriding the [DocsBuildStrategy](https://backstage.io/docs/reference/plugin-techdocs-node.docsbuildstrategy/)
- `techdocsPublisherExtensionPoint`
  - Register a custom docs publisher
- `techdocsGeneratorExtensionPoint`
  - Register a custom [TechdocsGenerator](https://backstage.io/docs/reference/plugin-techdocs-node.techdocsgenerator/)

Extension points are exported from `@backstage/plugin-techdocs-backend`.

## Examples

### Log TechDocs Build phase details to console

By default, the TechDocs build phase logs to the UI, but does not log to the console. However, the
`techdocsBuildsExtensionPoint` can be used to setup a custom Winston transport for TechDocs build logs.

Here is an example of logging to console:

```typescript jsx title="packages/backend/src/extensions/techDocsExtension.ts"
import { techdocsBuildsExtensionPoint } from '@backstage/plugin-techdocs-backend';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { transports } from 'winston';

export const techDocsExtension = createBackendModule({
  pluginId: 'techdocs',
  moduleId: 'techdocs-build-log-transport-extension',
  register(env) {
    env.registerInit({
      deps: {
        build: techdocsBuildsExtensionPoint,
      },
      async init({ build }) {
        // You can obviously use any custom transport here...
        build.setBuildLogTransport(new transports.Console());
      },
    });
  },
});
```

And then of course register this extension with the backend:

```typescript jsx title="packages/backend/src/index.ts"
import {techDocsExtension} from "./extensions/techDocsExtension";
...
backend.add(techDocsExtension);
```

# TechDocs Frontend Extensions

:::info
This section is written for [the new frontend system](../../frontend-system/index.md) which is still in alpha.
:::

The TechDocs frontend plugin provides the following extension points:

- **Custom TechDocsReaderLayout**: Replace the default reader page layout with a custom implementation

## Custom TechDocsReaderLayout

The TechDocs reader page supports providing a custom layout via the `TechDocsReaderLayoutBlueprint`. This allows you to completely customize the structure of the documentation reader page while still benefiting from the built-in TechDocs functionality.

### Default Layout

By default, TechDocs uses `TechDocsReaderLayout` which provides:

- A page header with entity information
- A subheader for addons
- The main documentation content area with optional search

```tsx
import { Page } from '@backstage/core-components';
import {
  TechDocsReaderPageHeader,
  TechDocsReaderPageSubheader,
  TechDocsReaderPageContent,
} from '@backstage/plugin-techdocs';

// This is what the default TechDocsReaderLayout looks like
const DefaultLayout = () => (
  <Page themeId="documentation">
    <TechDocsReaderPageHeader />
    <TechDocsReaderPageSubheader />
    <TechDocsReaderPageContent withSearch />
  </Page>
);
```

### Creating a Custom Layout

To provide a custom layout, use the `TechDocsReaderLayoutBlueprint` from `@backstage/plugin-techdocs-react/alpha`:

```tsx title="packages/app/src/extensions/customTechDocsLayout.tsx"
import { TechDocsReaderLayoutBlueprint } from '@backstage/plugin-techdocs-react/alpha';

export const customTechDocsReaderLayout = TechDocsReaderLayoutBlueprint.make({
  name: 'custom',
  params: {
    loader: () =>
      import('./CustomTechDocsLayout').then(m => m.CustomTechDocsLayout),
  },
});
```

Then create your custom layout component:

```tsx title="packages/app/src/extensions/CustomTechDocsLayout.tsx"
import React from 'react';
import { Page } from '@backstage/core-components';
import {
  TechDocsReaderPageHeader,
  TechDocsReaderPageSubheader,
  TechDocsReaderPageContent,
} from '@backstage/plugin-techdocs';
import type { TechDocsReaderLayoutProps } from '@backstage/plugin-techdocs-react/alpha';

export const CustomTechDocsLayout = (props: TechDocsReaderLayoutProps) => (
  <Page themeId="documentation">
    {/* Conditionally render header based on config */}
    {props.withHeader !== false && <TechDocsReaderPageHeader />}
    <TechDocsReaderPageSubheader />
    {/* Use withSearch from config, defaulting to true */}
    <TechDocsReaderPageContent withSearch={props.withSearch !== false} />
  </Page>
);
```

Finally, register the extension with your app:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { customTechDocsReaderLayout } from './extensions/customTechDocsLayout';

const app = createApp({
  features: [
    // ... other features
    customTechDocsReaderLayout,
  ],
});

export default app.createRoot();
```

### Configuration

The blueprint supports configuration via `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  extensions:
    - techdocs-reader-layout:custom:
        config:
          withHeader: false
          withSearch: true
```

### Use Cases

Common use cases for custom layouts include:

- **Removing the header**: For a cleaner, more minimal documentation view
- **Adding custom sidebars**: Include additional navigation or context-specific information
- **Integrating custom components**: Add organization-specific branding or functionality
- **Adjusting the search behavior**: Enable or disable the built-in search functionality
