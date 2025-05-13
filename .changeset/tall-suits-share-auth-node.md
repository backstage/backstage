---
'@backstage/plugin-auth-node': patch
---

Added a new `dangerousEntityRefFallback` option to the `signInWithCatalogUser` method in `AuthResolverContext`. The option will cause the provided entity reference to be used as a fallback in case the user is not found in the catalog. It is up to the caller to provide the fallback entity reference.

Auth providers that include pre-defined sign-in resolvers are encouraged to define a flag named `dangerouslyAllowSignInWithoutUserInCatalog` in their config, which in turn enables use of the `dangerousEntityRefFallback` option. For example:

```ts
export const usernameMatchingUserEntityName = createSignInResolverFactory({
  optionsSchema: z
    .object({
      dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
    })
    .optional(),
  create(options = {}) {
    return async (
      info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
      ctx,
    ) => {
      const { username } = info.result.fullProfile;
      if (!username) {
        throw new Error('User profile does not contain a username');
      }

      return ctx.signInWithCatalogUser(
        { entityRef: { name: username } },
        {
          dangerousEntityRefFallback:
            options?.dangerouslyAllowSignInWithoutUserInCatalog
              ? { entityRef: { name: username } }
              : undefined,
        },
      );
    };
  },
});
```
