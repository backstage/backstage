---
'@backstage/plugin-catalog-react': minor
---

Introduce the `useEntityOwnership` hook, which implements the full new ownership model.

This also means a breaking change to the interface of `UserListFilter`. It no longer
accepts a user entity as input, but rather a function that checks ownership of an
entity. This function is taken from the above mentioned hook output. So if you are
instantiating the filter yourself, you will change from something like

```ts
const { entity } = useOwnUser();
const filter = new UserListFilter('owned', user, ...);
```

to

```ts
const { isOwnedEntity } = useEntityOwnership();
const filter = new UserListFilter('owned', isOwnedEntity, ...);
```
