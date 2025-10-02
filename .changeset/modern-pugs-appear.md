---
'@backstage/cli': patch
---

Added a new `--entrypoint` option to the `package start` command, which allows you to specify a custom entry directory/file for development applications. This is particularly useful when maintaining separate dev apps for different versions of your plugin (e.g., stable and alpha).

**Example usage:**

Consider the following plugin dev folder structure:

```
dev/
  index.tsx
  alpha/
    index.ts
```

- The default `yarn package start` command uses the `dev/` folder as the entry point and executes `dev/index.tsx` file;
- Running `yarn package start --entrypoint dev/alpha` will instead use `dev/alpha/` as the entry point and execute `dev/alpha/index.ts` file.
