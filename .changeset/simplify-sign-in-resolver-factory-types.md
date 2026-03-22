---
'@backstage/plugin-auth-node': minor
---

**BREAKING**: Simplified `SignInResolverFactoryOptions` generic type parameters. Instead of `<TAuthResult, TOptionsOutput, TOptionsInput>`, the interface now uses `<TAuthResult, TSchema extends z.ZodType>`, following the Zod recommendation for writing generic functions. This fixes "Type instantiation is excessively deep and possibly infinite" errors that occurred when users had a different Zod version from Backstage core.

The `SignInResolverFactory` call signature now accepts `unknown` options, since the input is always validated by Zod at runtime. The default type parameters have been changed from `any` to `unknown`.

Migrated internal Zod usage from v3 to v4, replaced `zod-to-json-schema` with the built-in `z.toJSONSchema`, and replaced `zod-validation-error` with the built-in `z.prettifyError`.

Implemented the missing `allowedDomains` enforcement in `emailMatchingUserEntityProfileEmail`. The option was introduced in #28967 but was never wired up. It is now enforced the same way as in `emailLocalPartMatchingUserEntityName`.

If you have custom sign-in resolver factories, update them to use `.prefault()` on the Zod schema instead of `.optional()` with JavaScript-level parameter defaults:

```diff
  createSignInResolverFactory({
    optionsSchema: z
      .object({
-       dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
+       dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().prefault(false),
      })
-     .optional(),
-   create(options = {}) {
+     .prefault({}),
+   create({ dangerouslyAllowSignInWithoutUserInCatalog }) {
      return async (info, ctx) => {
-       if (options?.dangerouslyAllowSignInWithoutUserInCatalog) { ... }
+       if (dangerouslyAllowSignInWithoutUserInCatalog) { ... }
      };
    },
  });
```
