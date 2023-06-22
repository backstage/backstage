---
'@backstage/backend-common': patch
---

use `Readable.from` to explicitly convert the `buffer` from `node-fetch` to a `Readable` stream
