---
'@backstage/cli': patch
---

Added a new `--entry-dir` option to the `package start` command, which allows you to specify a custom entry directory for development applications. This is particularly useful when maintaining separate dev apps for different versions of your plugin (e.g., stable and alpha).

**Example usage:**

Consider the following plugin dev folder structure:

```
dev/
  index.tsx
  alpha/
    index.ts
```

- The default `yarn package start` command uses the `dev/` folder as the entry point and executes `dev/index.tsx`
- Running `yarn package start --entry-dir dev/alpha` will instead use `dev/alpha/` as the entry point and execute `dev/alpha/index.ts`

This enables you to maintain multiple development environments within a single plugin package.
