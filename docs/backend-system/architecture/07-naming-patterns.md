---
id: naming-patterns
title: Backend System Naming Patterns
sidebar_label: Naming Patterns
# prettier-ignore
description: Naming patterns in the backend system
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

These are the naming patterns to adhere to within the backend system. They help us keep exports consistent across packages and make it easier to understand the usage and intent of exports.

### Plugins

| Description | Pattern      | Examples                            |
| ----------- | ------------ | ----------------------------------- |
| export      | `<id>Plugin` | `catalogPlugin`, `scaffolderPlugin` |
| ID          | `'<id>'`     | `'catalog'`, `'scaffolder'`         |

Example:

```ts
export const catalogPlugin = createBackendPlugin({
  pluginId: 'catalog',
  ...
})
```

### Modules

| Description | Pattern                      | Examples                            |
| ----------- | ---------------------------- | ----------------------------------- |
| export      | `<pluginId>Module<ModuleId>` | `catalogModuleGithubEntityProvider` |
| ID          | `'<moduleId>'`               | `'githubEntityProvider'`            |

Example:

```ts
export const catalogModuleGithubEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'githubEntityProvider',
  ...
})
```

### Extensions

| Description | Pattern                          | Examples                               |
| ----------- | -------------------------------- | -------------------------------------- |
| Interface   | `<PluginId><Name>ExtensionPoint` | `CatalogProcessingExtensionPoint`      |
| Reference   | `<pluginId><Name>ExtensionPoint` | `catalogProcessingExtensionPoint`      |
| ID          | `'<pluginId>.<name>'`            | `'catalog.processing'`, `'foo.barBaz'` |

Example:

```ts
export interface CatalogProcessingExtensionPoint {
  ...
}

export const catalogProcessingExtensionPoint = createExtensionPoint<CatalogProcessingExtensionPoint>({
  id: 'catalog.processing',
  ...
})
```

### Services

| Description | Pattern                | Examples                                           |
| ----------- | ---------------------- | -------------------------------------------------- |
| Interface   | `<Name>Service`        | `LoggerService`, `DatabaseService`                 |
| Reference   | `<name>ServiceRef`     | `loggerServiceRef`, `databaseServiceRef`           |
| ID          | `<pluginId>.<name>`    | `'core.rootHttpRouter'`, `'catalog.catalogClient'` |
| Factory     | `<name>ServiceFactory` | `loggerServiceFactory`, `databaseServiceFactory`   |

Example:

```ts
export interface CatalogClientService {
  ...
}

export const catalogClientServiceRef = createServiceRef<CatalogClientService>({
  id: 'catalog.catalogClient',
  ...
})

export const catalogClientServiceFactory = createServiceFactory({
  service: catalogClientServiceRef,
  ...
})
```

An exception to the above service reference naming pattern has been made for the all of the core services in the core API. The `@backstage/backend-plugin-api` makes all core service references available via a single `coreServices` collection. Likewise, the `@backstage/backend-test-utils` exports all mock service implementations via a single `mockServices` collection. This means that the table above is slightly misleading, since `loggerServiceRef` and `databaseServiceRef` are instead available as `coreServices.logger` and `coreService.database`. We recommend that plugins avoid this patterns unless they have a very large number of services that they need to export.

While it is often preferred to prefix root scoped services with `Root`, it is not required. For example, `RootHttpRouterService` and `RootLifecycleService` follow this pattern, but `ConfigService` doesn't and it is a root scoped service.
