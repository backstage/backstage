---
'@backstage/plugin-catalog-backend': minor
---

Added new `POST /entities/by-refs` endpoint, which allows you to efficiently
batch-fetch entities by their entity ref. This can be useful e.g. in graphql
resolvers or similar contexts where you need to fetch many entities at the same
time.
