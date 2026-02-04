---
'@backstage/ui': patch
---

Allow data to be passed inplace to the `useTable` hook using the property `data` instead of `getData()` for mode `"complete"`.

This simplifies usage as data changes, rather than having to perform a `useEffect` when data changes, and then reloading the data. It also happens immediately, so stale data won't remain until a rerender (with an internal async state change), so less flickering.

Affected components: Table
