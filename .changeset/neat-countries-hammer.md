---
'@backstage/plugin-auth-backend': patch
---

**DEPRECATION** The `AuthResolverContext` has received a number of changes, which is the context used by auth handlers and sign-in resolvers.

The following fields deprecated: `logger`, `tokenIssuer`, `catalogIdentityClient`. If you need to access the `logger`, you can do so through a closure instead. The `tokenIssuer` has been replaced with an `issueToken` method, which is available directory on the context. The `catalogIdentityClient` has been replaced by the `signInWithCatalogUser` method, as well as the lower level `findCatalogUser` method and `getDefaultOwnershipEntityRefs` helper.

It should be possible to migrate most sign-in resolvers to more or less only use `signInWithCatalogUser`, for example an email lookup resolver like this one:

```ts
async ({ profile }, ctx) => {
  if (!profile.email) {
    throw new Error('Profile contained no email');
  }

  const entity = await ctx.catalogIdentityClient.findUser({
    annotations: {
      'acme.org/email': profile.email,
    },
  });

  const claims = getEntityClaims(entity);
  const token = await ctx.tokenIssuer.issueToken({ claims });

  return { id: entity.metadata.name, entity, token };
};
```

can be migrated to the following:

```ts
async ({ profile }, ctx) => {
  if (!profile.email) {
    throw new Error('Profile contained no email');
  }

  return ctx.signInWithCatalogUser({
    annotations: {
      'acme.org/email': profile.email,
    },
  });
};
```

While a direct entity name lookup using a user ID might look like this:

```ts
async ({ result: { fullProfile } }, ctx) => {
  return ctx.signInWithCatalogUser({
    entityRef: {
      name: fullProfile.userId,
    },
  });
};
```

If you want more control over the way that users are looked up, ownership is assigned, or tokens are issued, you can use a combination of the `findCatalogUser`, `getDefaultOwnershipEntityRefs`, and `issueToken` instead.
