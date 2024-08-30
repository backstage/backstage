---
id: extensions
title: Using TechDocs Extensions
sidebar_label: Using TechDocs Extensions
description: How to use the built-in TechDocs extension points
---

# TechDocs Backend Extensions

The TechDocs backend plugin provides the following extension points:

- `techdocsBuildsExtensionPoint`
- `techdocsGeneratorExtensionPoint`
- `techdocsPreparerExtensionPoint`
- `techdocsPublisherExtensionPoint`

## Build Extensions

### Set Log Transport

By default, the TechDocs build phase does not log out much information while building out TechDocs. However, the
`techdocsBuildsExtensionPoint` can be used to setup a custom Winston transport for TechDocs build logs.

Here is an example of logging to console:

```typescript jsx title="packages/backend/src/extensions/techDocsExtension.ts"
import { techdocsBuildsExtensionPoint } from '@backstage/plugin-techdocs-backend';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { transports } from 'winston';

export const techDocsExtension = createBackendModule({
  pluginId: 'techdocs',
  moduleId: 'extension',
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
backend.add(techDocsExtension());
```
