---
'@backstage/plugin-permission-node': patch
---

`createPermissionIntegrationRouter` now accepts rules and permissions for multiple resource types. Example:

```typescript
createPermissionIntegrationRouter({
  resources: [
    {
      resourceType: 'resourceType-1',
      permissions: permissionsResourceType1,
      rules: rulesResourceType1,
    },
    {
      resourceType: 'resourceType-2',
      permissions: permissionsResourceType2,
      rules: rulesResourceType2,
    },
  ],
});
```
