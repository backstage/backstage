---
'@backstage/plugin-search-backend-module-pg': minor
---

Fixed a bug in search-backend-module-pg where it ignores the skip migration database options when using the database.

To use this new implementation you need to create the instance of `DatabaseDocumentStore` using the `PluginDatabaseManager` instead of `Knex`;

```
import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { DatabaseDocumentStore } from '@backstage/plugin-search-backend-module-pg';

const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
const databaseDocumentStore = await DatabaseDocumentStore.create(databaseManager);
```
