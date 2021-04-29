---
id: installation
title: Installation
description: Installing Kubernetes plugin into Backstage
---

The Kubernetes feature is a plugin to Backstage, and it is exposed as a tab when
viewing entities in the software catalog.

If you haven't setup Backstage already, read the
[Getting Started](../../getting-started/index.md).

## Adding the Kubernetes frontend plugin

The first step is to add the frontend Kubernetes plugin to your Backstage
application. Navigate to your new Backstage application directory. And then to
your `packages/app` directory, and install the `@backstage/plugin-kubernetes`
package.

```bash
cd my-backstage-app/
cd packages/app
yarn add @backstage/plugin-kubernetes
```

Once the package has been installed, you need to import the plugin in your app
by adding the "Kubernetes" tab to the catalog entity page. In
`packages/app/src/components/catalog/EntityPage.tsx`, you'll add a router to get
to the tab, and add the tab itself.

`EntityPage.tsx`:

```tsx
import { Router as KubernetesRouter } from '@backstage/plugin-kubernetes';

// ...

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    // ...
    <EntityPageLayout.Content
      path="/kubernetes/*"
      title="Kubernetes"
      element={<KubernetesRouter entity={entity} />}
    />
    // ...
  </EntityPageLayout>
);
```

That's it! But now, we need the Kubernetes Backend plugin for the frontend to
work.

## Adding Kubernetes Backend plugin

Navigate to `packages/backend` of your Backstage app, and install the
`@backstage/plugin-kubernetes-backend` package.

```bash
cd my-backstage-app/
cd packages/backend
yarn add @backstage/plugin-kubernetes-backend
```

Create a file called `kubernetes.ts` inside `packages/backend/src/plugins/` and
add the following

`kubernetes.ts`:

```typescript
import { createRouter } from '@backstage/plugin-kubernetes-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  return await createRouter({ logger, config });
}
```

And import the plugin to `packages/backend/src/index.ts`. There are three lines
of code you'll need to add, and they should be added near similar code in your
existing Backstage backend.

`index.ts`:

```typescript
import kubernetes from './plugins/kubernetes';

// ...

const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));

// ...

apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
```

That's it! The Kubernetes frontend and backend have now been added to your
Backstage app.

## Running Backstage locally

Start the frontend and the backend app by
[running Backstage locally](../../getting-started/running-backstage-locally.md).

## Configuration

After installing the plugins in the code, you'll need to then
[configure them](configuration.md).

## Troubleshooting

After installing the plugins in the code, if the Kubernetes information is not
showing up, you'll need to [troubleshoot it](troubleshooting.md).
