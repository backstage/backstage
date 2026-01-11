---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-catalog-node': minor
---

Added new `POST /entities/by-predicates` endpoint for querying entities using predicate-based filters.

This endpoint supports a more expressive filter syntax with logical operators (`$all`, `$any`, `$not`) and value operators (`$exists`, `$in`).

Example usage:

```json
{
  "filter": {
    "$all": [
      { "kind": "component" },
      { "spec.type": { "$in": ["service", "website"] } },
      {
        "$any": [
          { "spec.owner": "backend-team" },
          { "spec.owner": "platform-team" }
        ]
      },
      { "$not": { "spec.lifecycle": "experimental" } },
      { "metadata.tags": { "$exists": true } }
    ]
  }
}
```
