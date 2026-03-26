---
'@backstage/plugin-auth-node': minor
---

**BREAKING**: Refactored `SignInResolverFactoryOptions` to use a schema-first generic pattern, following Zod's [recommended approach](https://zod.dev/library-authors?id=how-to-accept-user-defined-schemas#how-to-accept-user-defined-schemas) for writing generic functions. The type parameters changed from `<TAuthResult, TOptionsOutput, TOptionsInput>` to `<TAuthResult, TSchema extends ZodType>`.

This fixes "Type instantiation is excessively deep and possibly infinite" errors that occurred when the Zod version in a user's project did not align with the one in Backstage core.

If you use `createSignInResolverFactory` without explicit type parameters (the typical usage), no changes are needed:

```ts
// This usage is unchanged
createSignInResolverFactory({
  optionsSchema: z.object({ domain: z.string() }).optional(),
  create(options = {}) {
    /* ... */
  },
});
```

If you reference `SignInResolverFactoryOptions` with explicit type parameters, update as follows:

```diff
- SignInResolverFactoryOptions<MyAuthResult, MyOutput, MyInput>
+ SignInResolverFactoryOptions<MyAuthResult, typeof mySchema>
```
