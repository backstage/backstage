# @backstage/plugin-permission-common

Isomorphic types and client for Backstage permissions and authorization. For more information, see the [permissions documentation on Backstage.io](https://backstage.io/docs/permissions/overview).

## Classifying access levels

Permissions can declare an optional `accessLevel` alongside their action:

```ts
const taskReadPermission = createPermission({
  name: 'example.tasks.read',
  attributes: { action: 'read', accessLevel: 'admin' },
});
```

The attribute classifies the operation, not the caller. Omission represents
ordinary access. `admin` is a convention for administrative operations, and
custom string values are supported. The framework does not assign roles,
interpret a hierarchy, or automatically grant or deny access based on this field.

Your permission policy decides which callers can perform operations at each
level. A policy enforcing access levels should explicitly handle supported values
and deny unrecognized values. For example, inside a policy's `handle` method:

```ts
switch (request.permission.attributes.accessLevel) {
  case undefined:
    // Continue with the existing policy for ordinary operations.
    break;
  case 'admin':
    if (!user?.info.ownershipEntityRefs.includes('group:default/admins')) {
      return { result: AuthorizeResult.DENY };
    }
    // Continue with operation-specific checks, including resource conditions.
    break;
  default:
    return { result: AuthorizeResult.DENY };
}
```

Use a group appropriate for your installation. Classifying an operation as
administrative does not replace its specific permission name, action, or resource
conditions. An existing policy that allows every `read` action will continue to
allow administrative reads until the policy is updated.

Upgrade the permission backend before relying on the attribute. Older backends
strip it from authorization requests, so a policy that treats omission as
ordinary access can fail open. During a mixed-version rollout, policies that need
to deny missing administrative metadata must identify those operations
independently, for example by permission name. Updated backends preserve custom
string values so policies can reject levels they do not recognize.

This attribute does not add an `accessLevel` filter to service-token restrictions.
Those restrictions continue to match permission names and actions; token
restrictions based on access level require separate support in the authentication
and permission services.
