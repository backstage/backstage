---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-node': minor
---

BREAKING ALPHA: The `checkpoint` method now takes an object instead of previous arguments.

```ts
await ctx.checkpoint({ key: 'repo.create', fn: () => ockokit.repo.create({...})})
```

You can also now return `void` from the checkpoint if the method returns `void` inside the `checkpoint` handler.
