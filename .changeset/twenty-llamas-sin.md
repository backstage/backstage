---
'@backstage/create-app': patch
---

Removed lighthouse plugin from the default set up plugins, as it requires a separate Backend to function.

To apply this change to an existing app, remove the following:

1. The `lighthouse` block from `app-config.yaml`.
2. The `@backstage/plugin-lighthouse` dependency from `packages/app/package.json`.
3. The `@backstage/plugin-lighthouse` re-export from `packages/app/src/plugins.ts`.
4. The Lighthouse sidebar item from `packages/app/src/sidebar.tsx`, and the `RuleIcon` import if it is unused.
