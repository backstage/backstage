---
'@backstage/plugin-scaffolder-backend': minor
---

Fixed a bug in plugin-scaffolder-backend where it ignores the skip migration database options.

To use this new implementation you need to create the instance of `DatabaseTaskStore` using the `PluginDatabaseManager` instead of `Knex`;

```
import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';

const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
const databaseTaskStore = await DatabaseTaskStore.create(databaseManager);
```
