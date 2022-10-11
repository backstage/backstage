---
'@backstage/plugin-playlist-backend': minor
---

**BREAKING** The exported permission rules have changed to reflect the breaking changes made to the PermissionRule type.

For example, the `playlistConditions.isOwner` API has changed from:

```ts
playlistConditions.isOwner(['user:default/me', 'group:default/owner']);
```

to:

```ts
playlistConditions.isOwner({
  owners: ['user:default/me', 'group:default/owner'],
});
```
