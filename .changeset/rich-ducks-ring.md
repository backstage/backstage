---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-backend': minor
---

New POST /entities/by-query endpoint

- Supports predicate-based entity filtering using advanced query operators ($all, $any, $in, $not, $exists)
- Enables complex nested queries for more powerful entity searches
- Provides cursor-based pagination for efficient result traversal

Updated Catalog Client

- Enhanced queryEntities() method to automatically route requests to POST endpoint when query predicate is provided
- Validates mutual exclusivity between filter (legacy) and query (predicate-based) parameters
