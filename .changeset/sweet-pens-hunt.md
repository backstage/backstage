---
'@backstage/config-loader': minor
---

Deep visibility now also applies to values that are not covered by the configuration schema.

For example, given the following configuration schema:

```ts
// plugins/a/config.schema.ts
export interface Config {
  /** @deepVisibility frontend */
  a?: unknown;
}

// plugins/a/config.schema.ts
export interface Config {
  a?: {
    b?: string;
  };
}
```

All values under `a` are now visible to the frontend, while previously only `a` and `a/b` would've been visible.
