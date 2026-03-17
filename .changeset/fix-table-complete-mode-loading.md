---
'@backstage/ui': patch
---

Fixed a bug in the `useTable` hook where the loading skeleton was never shown for `complete` mode when using `getData`. The initial data state was an empty array instead of `undefined`, causing the `Table` component to skip the loading state.
