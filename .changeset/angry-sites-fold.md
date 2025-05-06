---
'@backstage/plugin-auth-backend': patch
---

Added the configuration flag `auth.omitIdentityTokenOwnershipClaim` that causes issued user tokens to no longer contain the `ent` claim that represents the ownership references of the user.

The benefit of this new flag is that issued user tokens will be much smaller in
size, but they will no longer be self-contained. This means that any consumers
of the token that require access to the ownership claims now need to call the
`/api/auth/v1/userinfo` endpoint instead. Within the Backstage ecosystem this is
done automatically, as clients will still receive the full set of claims during
authentication, while plugin backends will need to use the `UserInfoService`
which already calls the user info endpoint if necessary.

When enabling this flag, it is important that any custom sign-in resolvers directly return the result of the sign-in method. For example, the following would not work:

```ts
const { token } = await ctx.issueToken({
  claims: { sub: entityRef, ent: [entityRef] },
});
return { token }; // WARNING: This will not work with the flag enabled
```

Instead, the sign-in resolver should directly return the result:

```ts
return ctx.issueToken({
  claims: { sub: entityRef, ent: [entityRef] },
});
```
