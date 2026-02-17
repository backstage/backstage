---
id: extensions
title: Using TechDocs Extensions
sidebar_label: Using TechDocs Extensions
description: How to use the built-in TechDocs extension points
---

# TechDocs Backend Extensions

The TechDocs backend plugin provides the following extension points:

- `techdocsPreparerExtensionPoint`
  - Register a custom docs [PreparerBase extension](https://backstage.io/api/stable/types/_backstage_plugin-techdocs-node.PreparerBase.html)
  - Ideal for when you want a custom type of docs created for a specific entity type
- `techdocsBuildsExtensionPoint`
  - Allows overriding the build phase Winston log transport (by default does not log to console)
  - Allows overriding the [DocsBuildStrategy](https://backstage.io/api/stable/interfaces/_backstage_plugin-techdocs-node.DocsBuildStrategy.html)
- `techdocsPublisherExtensionPoint`
  - Register a custom docs publisher
- `techdocsGeneratorExtensionPoint`
  - Register a custom [TechdocsGenerator](https://backstage.io/api/stable/classes/_backstage_plugin-techdocs-node.TechdocsGenerator.html)

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
