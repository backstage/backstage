---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-permission-backend': minor
'@backstage/plugin-permission-common': minor
'@backstage/plugin-permission-node': minor
'@backstage/plugin-playlist-backend': minor
---

**BREAKING**: When defining permission rules, it's now necessary to provide a ZodSchema that specifies the parameters the rule expects. This has been added to help better describe the parameters in the response of the metadata endpoint and to validate the parameters before a rule is executed.

To help with this, we have also made a change to the API of permission rules. Before, the permission rules `toQuery` and `apply` signature expected parameters to be seprate arguments, like so...

```ts
createPermissionRule({
  apply: (resource, foo, bar) => true,
  toQuery: (foo, bar) => {},
});
```

The API has now changed to expect the parameters as a single object

```ts
createPermissionRule({
  schema: z.object({
    foo: z.string().describe('Foo value to match'),
    bar: z.string().describe('Bar value to match'),
  }),
  apply: (resource, { foo, bar }) => true,
  toQuery: ({ foo, bar }) => {},
});
```
