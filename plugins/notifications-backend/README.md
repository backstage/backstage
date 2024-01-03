# Notifications

This Backstage backend plugin provides REST API endpoint for the notifications.

It's backed by a relational database, so far tested with PostgreSQL.

## Getting started

### Prerequisities

- Install [PostgresSQL DB](https://www.postgresql.org/download/)
- Configure Postgres for tcp/ip
  Open Postgres conf file for editing:

```bash
sudo vi /var/lib/pgsql/data/pg_hba.conf
```

Add this line:

```bash
host   all             postgres       127.0.0.1/32                          password
```

- Start Postgres server:

```bash
sudo systemctl enable --now postgresql.service
```

A new DB will be created: backstage_plugin_notifications

### Add NPM dependency

```
cd packages/backend
yarn add @backstage/plugin-notifications-backend
```

### Add backend-plugin

Create `packages/backend/src/plugins/notifications.ts` with following content:

```
import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-notifications-backend';

import { Router } from 'express';

import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: env.discovery });
  const dbConfig = env.config.getConfig('backend.database');
  return await createRouter({
    logger: env.logger,
    dbConfig,
    catalogClient,
  });
}
```

### Add to router

In the `packages/backend/src/index.ts`:

```
import notifications from './plugins/notifications';
...
{/* Existing code for reference: */}
const apiRouter = Router();
...
{/* New code: */}
const notificationsEnv = useHotMemoize(module, () =>
  createEnv('notifications'),
);
apiRouter.use('/notifications', await notifications(notificationsEnv));
```

### Configure

In the `app-config.yaml` or `app-config.local.yaml`:

#### Database

```
  database:
    client: pg
    connection:
      host: 127.0.0.1
      port: 5432
      user: postgres
      password: secret
    knexConfig:
      pool:
        min: 3
        max: 12
        acquireTimeoutMillis: 60000
        idleTimeoutMillis: 60000
  cache:
    store: memory
```

#### Catalog

The notifications require affected users or groups (as receivers) to be listed in the Catalog.

As an example how to do it, add following to the config:

```
catalog:
  import:
    entityFilename: catalog-info.yaml
    pullRequestBranchName: backstage-integration
  rules:
    # *** Here is new change:
    - allow: [Component, System, API, Resource, Location, User, Group]
  locations:
    # Local example data, file locations are relative to the backend process, typically `packages/backend`
    - type: file
      # *** Here is new change, referes to a file stored in the root of the Backstage:
      target: ../../users.yaml
```

The example list of users is stored in the `plugins/notifications-backend/users.yaml` and can be copied to the root of the Backstage for development purposes.

## REST API

See `src/openapi.yaml` for full OpenAPI spec.

### Posting a notification

A notification without users or groups is considered a system notification. That means it is is intended for all users.

Request (User message and then system message):

```bash
curl -X POST http://localhost:7007/api/notifications/notifications -H "Content-Type: application/json" -d '{"title": "My message title", "message": "I have nothing to say", "origin": "my-origin", "targetUsers": ["jdoe"], "targetGroups": ["jdoe"], "actions": [{"title": "my-title", "url": "http://foo.bar"}, {"title": "another action", "url": "https://foo.foo.bar"}]}'
```

```bash
curl -X POST http://localhost:7007/api/notifications/notifications -H "Content-Type: application/json" -d '{"title": "My message title", "message": "I have nothing to say", "origin": "my-origin", "actions": [{"title": "my-title", "url": "http://foo.bar"}, {"title": "another action", "url": "https://foo.foo.bar"}]}'
```

Response:

```json
{ "msgid": "2daac6ff-3aaa-420d-b755-d94e54248310" }
```

### Get notifications

Page number starts at '1'. Page number '0' along with page size '0' means no paging.
User parameter is mandatory because it is needed for message status and filtering (read/unread).

Query parameters:

- pageSize. 0 means no paging.
- pageNumber. first page is 1. 0 means no paging.
- orderBy.
- orderByDirec. asc/desc
- user. name of user to retrieve notification for
- containsText. filter title and message containing this text (case insensitive)
- createdAfter. fetch notifications created after this point in time
- messageScope. all/user/system. fetch notifications intended for specific user or system notifications or both
- read. true/false (read/unread)

Request:

```bash
curl 'http://localhost:7007/api/notifications/notifications?user=loggedinuser&read=false&pageNumber=0&pageSize=0'
```

Response:

```json
[
  {
    "id": "2daac6ff-3aaa-420d-b755-d94e54248310",
    "created": "2023-10-30T13:48:34.931Z",
    "isSystem": false,
    "readByUser": false,
    "origin": "my-origin",
    "title": "My title",
    "message": "I have nothing to tell",
    "topic": "my-topic",
    "actions": []
  }
]
```

### Get count of notifications

User parameter is mandatory because it is needed for filtering (read/unread).

Query parameters:

- user. name of user to retrieve notification for
- containsText. filter title and message containing this text (case insensitive)
- createdAfter. fetch notifications created after this point in time
- messageScope. all/user/system. fetch notifications intended for specific user or system notifications or both
- read. true/false (read/unread)

Request:

```bash
curl http://localhost:7007/api/notifications/notifications/count?user=loggedinuser
```

Response:

```json
{ "count": "1" }
```

### Set notification as read/unread

Request:

```bash
curl -X PUT 'http://localhost:7007/api/notifications/notifications/read?messageID=48bbf896-4b7c-4b68-a446-246b6a801000&user=dummy&read=true'
```

Response: just HTTP status

## Users

A user the notifications are filtered for, all targetUsers or targetGroups must have corresponding entities created in the Catalog.
Refer [Backstage documentation](https://backstage.io/docs/auth/) for details.

For the purpose of development, there is `users.yaml` listing example data.

## Building a client for the API

We supply an Open API spec YAML file: openapi.yaml.
