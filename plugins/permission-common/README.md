# @backstage/plugin-permission-common

Isomorphic types and client for Backstage permissions and authorization. For more information, see the [permissions documentation on Backstage.io](https://backstage.io/docs/permissions/overview).

## Universal resource access

Use `resourceRef: false` with a resource permission to check
whether the policy grants access unconditionally across all resources:

```ts
const [decision] = await permissions.authorize(
  [{ permission: resourcePermission, resourceRef: false }],
  { credentials },
);
```

Universal checks return `ALLOW` only for an unconditional policy grant. Both
`DENY` and `CONDITIONAL` policy decisions produce `DENY`, and no conditions are
returned to the caller. The permission backend does not try to prove that a set
of conditions matches every resource. These checks work for any resource
permission, including from frontend clients.

A request must choose either a specific `resourceRef` or `resourceRef: false`.
Universal checks are not valid for basic permissions. Ordinary direct user
requests for resource permissions still require a reference. Backend plugins can
continue using `authorizeConditional` without a reference when they need the
actual policy conditions.

Upgrade the permission backend before using universal checks in clients. Older
backends do not support this request mode. Disabled permissions and service
principal access restrictions retain their existing behavior.

## Shared administration permission (alpha)

Plugins can opt into a shared administration capability by checking
`adminPermission` from `@backstage/plugin-permission-common/alpha`. Enable
permissions and install the permission backend and your policy module as usual.
The permission backend registers the permission and evaluates plugin conditions.
Consumers do not register it in their own permission registry.

Use the exact plugin ID as `resourceRef`, such as `catalog`, to check plugin
administration. Use `resourceRef: false` for operations requiring
universal administration. An unconditional `ALLOW` grants both; conditional
decisions restrict administration to matching plugins.

This permission does not override other permissions or assign administrators.
Plugins choose which operations require it, and the installed policy controls
all grants.

### Writing a policy

Handle the shared permission before your existing policy logic. For example,
inside your policy's `handle(request, user)` method:

```ts
import {
  AuthorizeResult,
  isPermission,
} from '@backstage/plugin-permission-common';
import { adminPermission } from '@backstage/plugin-permission-common/alpha';
import {
  createAdminConditionalDecision,
  adminConditions,
} from '@backstage/plugin-permission-node/alpha';

// Inside handle(request, user):
if (isPermission(request.permission, adminPermission)) {
  const groups = user?.info.ownershipEntityRefs ?? [];
  if (groups.includes('group:default/instance-admins')) {
    return { result: AuthorizeResult.ALLOW };
  }
  if (groups.includes('group:default/catalog-admins')) {
    return createAdminConditionalDecision(
      request.permission,
      adminConditions.isPlugin({ pluginIds: ['catalog'] }),
    );
  }
  return { result: AuthorizeResult.DENY };
}
// Continue with your existing policy for all other permissions.
```

Use groups appropriate for your installation. The policy receives the permission,
not the resource reference. Return conditions to restrict
plugin access. `IS_PLUGIN` matches exact, case-sensitive IDs and does not interpret
wildcards. Conditions support the permission framework's usual `anyOf`, `allOf`,
and `not` composition. Plugin IDs do not need to correspond to an installed
backend plugin, which also allows administration of frontend-only plugins. This
capability does not provide a registry of installed plugins.

### Checking access in a plugin

In a backend plugin, use `coreServices.permissions` and credentials obtained from
`coreServices.httpAuth`. For an administrative catalog operation:

```ts
const credentials = await httpAuth.credentials(req);
const [decision] = await permissions.authorize(
  [{ permission: adminPermission, resourceRef: 'catalog' }],
  { credentials },
);
if (decision.result !== AuthorizeResult.ALLOW) {
  throw new NotAllowedError('Catalog administration requires permission');
}
```

Import `NotAllowedError` from `@backstage/errors`. Choose the plugin ID on the
server based on the operation being protected. Do not let a caller select a
less privileged plugin ID to authorize an operation belonging to another plugin.
For an operation requiring universal administration, check
`{ permission: adminPermission, resourceRef: false }` instead.

In the frontend, use `usePermission` from `@backstage/plugin-permission-react`:

```tsx
const catalogAdmin = usePermission({
  permission: adminPermission,
  resourceRef: 'catalog',
});
const universalAdmin = usePermission({
  permission: adminPermission,
  resourceRef: false,
});
```

`RequirePermission` also accepts `resourceRef={false}`:

```tsx
<RequirePermission permission={adminPermission} resourceRef={false}>
  <InstanceAdministrationPage />
</RequirePermission>
```

Leaving `resourceRef` undefined still makes `usePermission` return
`allowed: false`, supporting resources that are loading
asynchronously. Frontend checks control presentation; backend checks enforce
access. Existing plugins, including DevTools, retain their existing permissions
until they explicitly adopt this capability. Adopting it for an existing
operation requires an intentional policy migration. Disabled permissions and
allow-all policies retain their normal allow-all behavior.
