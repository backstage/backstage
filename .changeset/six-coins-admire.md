---
'@backstage/plugin-tech-insights-backend': patch
'@backstage/plugin-tech-insights-node': patch
---

Adds a configuration option to fact retrievers to define lifecycle for facts the retriever persists. Possible values are either 'items-to-live' or 'time-to-live'. The former will keep only n number of items in to the database for each fact per entity. The latter will remove all facts that are older than the TTL value.

Possible values:

- `{ itl: 5 }` // Deletes all facts for the retriever/entity pair, apart from the last five
- `{ ttl: 1209600000 }` // (2 weeks) Deletes all facts older than 2 weeks for the retriever/entity pair
- `{ ttl: { weeks: 2 } }` // Deletes all facts older than 2 weeks for the retriever/entity pair
