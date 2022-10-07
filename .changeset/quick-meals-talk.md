---
'@backstage/plugin-playlist-backend': minor
---

**BREAKING** Due to the changes made in the Permission framework. The playlist backends permission rules have change to reflect this.

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
