# Time Saver - backend

This plugin provides an implementation of charts and statistics related to your time savings that are coming from usage of your templates. Plugins is built from frontend and backend part. Backend plugin is responsible for scheduled stats parsing process and data storage.

## Dependencies

- [time-saver](./time-saver)
- [time-saver-common](./time-saver-common)

## Installation

1. Install the plugin package in your Backstage app:

```sh
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/backstage-plugin-time-saver-backend
```

2. Wire up the API implementation to your App in timeSaver.ts file in `packages/backend/src/plugins/`:

```ts
import { createRouter } from 'backstage-plugin-time-saver-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    database: env.database,
    config: env.config,
    scheduler: env.scheduler,
  });
}
```

in `packages/backend/src/index.ts`

```ts

import timeSaver from './plugins/timeSaver';

...

const timeSaverEnv = useHotMemoize(module, () => createEnv('timesaver'));

...

apiRouter.use('/time-saver', await signals(timeSaverEnv));

```

## Generate Statistics

Configure your template definition like described below:
Provide an object under `metadata`. Provide quantities of saved time by each group executing one template in **_hours_** preferably

```yaml
 apiVersion: scaffolder.backstage.io/v1beta3
 kind: Template
 metadata:
     name: example-template
     title: create-github-project
     description: Creates Github project
+      substitute:
+        engineering:
+          devops: 1
+          security: 4
+          development_team: 2
 spec:
     owner: group:default/backstage-admins
     type: service
```

Scheduler is running with its default setup every **5 minutes** to generate data from executed templates with these information.

## Migration

This plugins supports backward compatibility with migration. You can specify your Time Saver metadata for each template name. Then the migration will be performed once executing the API request to `/migrate` endpoint of the plugin.

Configure your backward time savings here:

Open the `app-config.yaml` file

```yaml
ts:
  backward:
    config: |
      [
        {
          "entityRef": "template:default/create-github-project",
          "engineering": {
            "devops": 8,
            "development_team": 8,
            "security": 3
          }
        },
      ]
```
