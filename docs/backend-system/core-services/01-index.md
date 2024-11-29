---
id: index
title: Core Backend Service APIs
sidebar_label: Overview
# prettier-ignore
description: Core backend service APIs
---

The default backend provides several [core services](https://github.com/backstage/backstage/blob/master/packages/backend-plugin-api/src/services/definitions/coreServices.ts) out of the box which includes access to configuration, logging, URL Readers, databases and more.

All core services are available through the `coreServices` namespace in the `@backstage/backend-plugin-api` package:

```ts
import { coreServices } from '@backstage/backend-plugin-api';
```

## Service Documentation Index

- [Auth Service](./auth.md) - Token authentication and credentials management.
- [Cache Service](./cache.md) - Key-value store for caching data.
- [Database Service](./database.md) - Database access and management via [knex](https://knexjs.org/).
- [Discovery Service](./discovery.md) - Service discovery for inter-plugin communication.
- [Http Auth Service](./http-auth.md) - Authentication of HTTP requests.
- [Http Router Service](./http-router.md) - HTTP route registration for plugins.
- [Identity Service](./identity.md) - Deprecated user authentication service, use the [Auth Service](./auth.md) instead.
- [Lifecycle Service](./lifecycle.md) - Registration of plugin startup and shutdown lifecycle hooks.
- [Logger Service](./logger.md) - Plugin-level logging.
- [Permissions Service](./permissions.md) - Permission system integration for authorization of user actions.
- [Plugin Metadata Service](./plugin-metadata.md) - Built-in service for accessing metadata about the current plugin.
- [Root Config Service](./root-config.md) - Access to static configuration.
- [Root Health Service](./root-health.md) - Health check endpoints for the backend.
- [Root Http Router Service](./root-http-router.md) - HTTP route registration for root services.
- [Root Lifecycle Service](./root-lifecycle.md) - Registration of backend startup and shutdown lifecycle hooks.
- [Root Logger Service](./root-logger.md) - Root-level logging.
- [Scheduler Service](./scheduler.md) - Scheduling of distributed background tasks.
- [Token Manager Service](./token-manager.md) - Deprecated service authentication service, use the [Auth Service](./auth.md) instead.
- [Url Reader Service](./url-reader.md) - Reading content from external systems.
- [User Info Service](./user-info.md) - Authenticated user information retrieval.
