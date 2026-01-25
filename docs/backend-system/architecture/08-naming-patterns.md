---
id: naming-patterns
title: Backend System Naming Patterns
sidebar_label: Naming Patterns
description: Naming patterns in the backend system
---

These are the naming patterns to adhere to within the backend system. They help us keep exports consistent across packages and make it easier to understand the usage and intent of exports.

As a rule, all names should be camel case, with the exceptions of plugin and module IDs, which should be kebab case.

### Plugins

| Description | Pattern           | Examples                              | Notes                                               |
| ----------- | ----------------- | ------------------------------------- | --------------------------------------------------- |
| export      | `<camelId>Plugin` | `catalogPlugin`, `userSettingsPlugin` |                                                     |
| ID          | `'<kebab-id>'`    | `'catalog'`, `'user-settings'`        | letters, digits, and dashes, starting with a letter |

Example:

```ts
export const userSettingsPlugin = createBackendPlugin({
  pluginId: 'user-settings',
  ...
})
```

### Modules

| Description | Pattern                      | Examples                            | Notes                                               |
| ----------- | ---------------------------- | ----------------------------------- | --------------------------------------------------- |
| export      | `<pluginId>Module<ModuleId>` | `catalogModuleGithubEntityProvider` |                                                     |
| ID          | `'<module-id>'`              | `'github-entity-provider'`          | letters, digits, and dashes, starting with a letter |

Example:

```ts
export const catalogModuleGithubEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github-entity-provider',
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

An exception to the above service reference naming pattern has been made for all of the core services in the core API. The `@backstage/backend-plugin-api` makes all core service references available via a single `coreServices` collection. Likewise, the `@backstage/backend-test-utils` exports all mock service implementations via a single `mockServices` collection. This means that the table above is slightly misleading, since `loggerServiceRef` and `databaseServiceRef` are instead available as `coreServices.logger` and `coreService.database`. We recommend that plugins avoid this patterns unless they have a very large number of services that they need to export.

While it is often preferred to prefix root scoped services with `Root`, it is not required. For example, `RootHttpRouterService` and `RootLifecycleService` follow this pattern, but `ConfigService` doesn't and it is a root scoped service.
