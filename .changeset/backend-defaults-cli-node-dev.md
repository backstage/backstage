---
'@backstage/backend-defaults': patch
---

Removed the runtime dependency on `@backstage/cli-node`, which was only used for types. Backends no longer install the CLI tooling packages through `@backstage/backend-defaults`.
