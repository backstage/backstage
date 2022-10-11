---
'@backstage/plugin-playlist-backend': minor
---

**BREAKING** The exported permission rules have changed to reflect the breaking changes made to the PermissionRule type.

As an example the `playlistConditions.isOwner` API has changed from

```ts
playlistConditions.isOwner(['user:default/me', 'group:default/owner']);
```

to the new API

```ts
playlistConditions.isOwner({
  owners: ['user:default/me', 'group:default/owner'],
});
```
