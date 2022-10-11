---
'@backstage/plugin-permission-common': minor
'@backstage/plugin-permission-node': minor
---

**BREAKING**: When defining permission rules, it's now necessary to provide a [ZodSchema](https://github.com/colinhacks/zod) that specifies the parameters the rule expects. This has been added to help better describe the parameters in the response of the metadata endpoint and to validate the parameters before a rule is executed.

To help with this, we have also made a change to the API of permission rules. Before, the permission rules `toQuery` and `apply` signature expected parameters to be separate arguments, like so...

```ts
createPermissionRule({
  apply: (resource, foo, bar) => true,
  toQuery: (foo, bar) => {},
});
```

The API has now changed to expect the parameters as a single object

```ts
createPermissionRule({
  paramSchema: z.object({
    foo: z.string().describe('Foo value to match'),
    bar: z.string().describe('Bar value to match'),
  }),
  apply: (resource, { foo, bar }) => true,
  toQuery: ({ foo, bar }) => {},
});
```

One final change made is to limit the possible values for a parameter to primitives and arrays of primitives.
