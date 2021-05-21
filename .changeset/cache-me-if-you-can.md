---
'@backstage/create-app': patch
---

Cache management has been added to the Backstage backend.

To apply this change to an existing app, make the following changes:

```diff
// packages/backend/src/types.ts

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
+  PluginCacheManager,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  UrlReader,
} from '@backstage/backend-common';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
+  cache: PluginCacheManager;
  config: Config;
  reader: UrlReader
  discovery: PluginEndpointDiscovery;
};
```

```diff
// packages/backend/src/index.ts

import Router from 'express-promise-router';
import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
+  CacheManager,
  SingleConnectionDatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);

  root.info(`Created UrlReader ${reader}`);

  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
+  const cacheManager = CacheManager.fromConfig(config);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
-    return { logger, database, config, reader, discovery };
+    const cache = cacheManager.forPlugin(plugin);
+    return { logger, database, cache, config, reader, discovery };
  };
}
```

To configure a cache store, add a `backend.cache` key to your app-config.yaml.

```diff
// app-config.yaml

backend:
  baseUrl: http://localhost:7000
  listen:
    port: 7000
  database:
    client: sqlite3
    connection: ':memory:'
+  cache:
+    store: memory
```
