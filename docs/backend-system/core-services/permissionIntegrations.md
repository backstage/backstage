---
id: permissions
title: Permission Integrations Service
sidebar_label: Permission Integrations
description: Documentation for the Permission Integrations service
---

This service allows your plugins to register new permissions, rules, and resource types and integrate with [the permissions framework](../../permissions/overview.md).

## Using the service

For a deep dive into how to use the `permissionIntegrations` service, see the [permission guide for plugin authors](../../permissions/plugin-authors/01-setup.md).

If all you want to do is add new custom permission rules to an existing plugin, you can instead refer to the [custom permission rules guide](../../permissions/custom-rules.md).

## Migrating from `createPermissionIntegrationRouter`

Before this service was introduced, plugins would use
`createPermissionIntegrationRouter` to implement the same functionality. To
migrate a plugin, locate the `createPermissionIntegrationRouter` call for your
router and remove it, but copy all options that are passed to it, for example:

```ts
export async function createRouter() {
  const router = Router();

  /* highlight-remove-start */
  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    resourceType: RESOURCE_TYPE_MY_RESOURCE,
    permissions: [myResourcePermissions],
    rules: [myResourceRule],
  });

  router.use(permissionIntegrationRouter);
  /* highlight-remove-end */

  // ...
}
```

Next, add a dependency on the `PermissionIntegrationsService` to your plugin,
and pass it the same options:

```ts
export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        /* highlight-add-next-line */
        permissionIntegrations: coreServices.permissionIntegrations,
      },
      /* highlight-remove-next-line */
      async init({ logger }) {
        /* highlight-add-next-line */
      async init({ logger, permissionIntegrations }) {
        logger.log('This is a silly example plugin with no functionality');

        /* highlight-add-start */
        permissionIntegrations.addResourceType({
          resourceType: RESOURCE_TYPE_MY_RESOURCE,
          permissions: [myResourcePermissions],
          rules: [myResourceRule],
        });
        /* highlight-add-end */
      },
    });
  },
});
```

If you only passed the `permissions` option to
`createPermissionIntegrationRouter`, you will want to use
`permissionIntegrations.addPermissions` instead.

If you passed multiple resources types to `createPermissionIntegrationRouter`
via the `resources` option, you will want to call
`permissionIntegrations.addResourceType` multiple times for each of those
resource types.
