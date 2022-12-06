---
'@backstage/backend-common': minor
'@backstage/backend-tasks': minor
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
'@backstage/plugin-search-backend-node': patch
---

Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
of the one from `node-abort-controller`. This is possible now that the minimum
supported Node.js version of the project is 16.

Note that their interfaces are very slightly different, but typically not in a
way that matters to consumers. If you see any typescript errors as a direct
result from this, they are compatible with each other in the ways that we
interact with them, and should be possible to type-cast across without ill
effects.
