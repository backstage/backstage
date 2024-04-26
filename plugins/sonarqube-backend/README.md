# sonarqube-backend

Welcome to the sonarqube-backend backend plugin!

## New Backend System

The Sonarqube backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
  const backend = createBackend();
  // ... other feature additions
+ backend.add(import('@backstage/plugin-sonarqube-backend'));
  backend.start();
```

## Integrating into a backstage instance

This plugin needs to be added to an existing backstage instance.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-sonarqube-backend
```

Typically, this means creating a `src/plugins/sonarqube.ts` file and adding a reference to it to `src/index.ts` in the backend package.

### sonarqube.ts

```typescript
import {
  createRouter,
  DefaultSonarqubeInfoProvider,
} from '@backstage/plugin-sonarqube-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    sonarqubeInfoProvider: DefaultSonarqubeInfoProvider.fromConfig(env.config),
  });
}
```

### src/index.ts

```diff
diff --git a/packages/backend/src/index.ts b/packages/backend/src/index.ts
index 1942c36ad1..7fdc48ba24 100644
--- a/packages/backend/src/index.ts
+++ b/packages/backend/src/index.ts
@@ -50,6 +50,7 @@ import scaffolder from './plugins/scaffolder';
 import proxy from './plugins/proxy';
 import search from './plugins/search';
 import techdocs from './plugins/techdocs';
+import sonarqube from './plugins/sonarqube';
 import techInsights from './plugins/techInsights';
 import todo from './plugins/todo';
 import graphql from './plugins/graphql';
@@ -133,6 +134,7 @@ async function main() {
     createEnv('tech-insights'),
   );
   const permissionEnv = useHotMemoize(module, () => createEnv('permission'));
+  const sonarqubeEnv = useHotMemoize(module, () => createEnv('sonarqube'));

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
@@ -152,6 +154,7 @@ async function main() {
   apiRouter.use('/badges', await badges(badgesEnv));
   apiRouter.use('/jenkins', await jenkins(jenkinsEnv));
   apiRouter.use('/permission', await permission(permissionEnv));
+  apiRouter.use('/sonarqube', await sonarqube(sonarqubeEnv));
   apiRouter.use(notFoundHandler());

   const service = createServiceBuilder(module)

```

This plugin must be provided with a `SonarqubeInfoProvider`, this is a strategy object for finding Sonarqube instances in configuration and retrieving data from an instance.

There is a standard one provided (`DefaultSonarqubeInfoProvider`), but the Integrator is free to build their own.

### DefaultSonarqubeInfoProvider

Allows configuration of either a single or multiple global Sonarqube instances and annotating entities with the instance name. This instance name in the entities is optional, if not provided the default instance in configuration will be used. That allow to keep configuration from before multiple instances capability to keep working without changes.

#### Example - Single global instance

##### Config

```yaml
sonarqube:
  baseUrl: https://sonarqube.example.com
  apiKey: 123456789abcdef0123456789abcedf012
```

##### Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  annotations:
    sonarqube.org/project-key: YOUR_INSTANCE_NAME/YOUR_PROJECT_KEY
```

#### Example - Multiple global instance

The following will look for findings at `https://special-project-sonarqube.example.com` for the project of key `YOUR_PROJECT_KEY`.

##### Config

```yaml
sonarqube:
  instances:
    - name: default
      baseUrl: https://default-sonarqube.example.com
      apiKey: 123456789abcdef0123456789abcedf012
    - name: specialProject
      baseUrl: https://special-project-sonarqube.example.com
      apiKey: abcdef0123456789abcedf0123456789ab
```

##### Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  annotations:
    sonarqube.org/project-key: specialProject/YOUR_PROJECT_KEY
```

If the `specialProject/` part is omitted (or replaced with `default/`), the Sonarqube instance of name `default` will be used.

The following config is an equivalent (but less clear) version of the above:

```yaml
sonarqube:
  baseUrl: https://default-sonarqube.example.com
  apiKey: 123456789abcdef0123456789abcedf012
  instances:
    - name: specialProject
      baseUrl: https://special-project-sonarqube.example.com
      apiKey: abcdef0123456789abcedf0123456789ab
```

#### Example - Different frontend and backend URLs

In some instances, you might want to use one URL for the backend and another for the frontend.
This can be achieved by using the optional `externalBaseUrl` property in the config.

##### Single instance config

```yaml
sonarqube:
  baseUrl: https://sonarqube-internal.example.com
  externalBaseUrl: https://sonarqube.example.com
  apiKey: 123456789abcdef0123456789abcedf012
```

##### Multiple instance config

```yaml
sonarqube:
  instances:
    - name: default
      baseUrl: https://default-sonarqube-internal.example.com
      externalBaseUrl: https://default-sonarqube.example.com
      apiKey: 123456789abcdef0123456789abcedf012
    - name: specialProject
      baseUrl: https://special-project-sonarqube.example.com
      apiKey: abcdef0123456789abcedf0123456789ab
```

## Links

- [Sonarqube Frontend](../sonarqube/README.md)
