---
'@backstage/plugin-catalog-react': major
'@backstage/catalog-client': minor
---

**BREAKING** Expand `EntityFilter.getCatalogFilters` to return `EntityFilterQuery`

```diff
import { Entity } from '@backstage/catalog-model';
+ import { EntityFilterQuery } from '@backstage/catalog-client';

/** @public */
export type EntityFilter = {
-  getCatalogFilters?: () => Record<
-    string,
-    string | symbol | (string | symbol)[]
-  >;
+  getCatalogFilters?: () => EntityFilterQuery;
};
```

This change allows `EntityFilter`s to utilize more complete functionality of the `CatalogApi`, specifically the
`queryEntities` and `getEntities` methods which support an `EntityFilterQuery` as the `filter` parameter in the request.

Allowing `EntityFilter`s to return a complete `EntityFilterQuery` allows them to produce more complex filter logic.

The primary example is allowing an `EntityFilter` to produce an array of filter records that would produce an 'OR'
query, filtering on A OR B criteria.

To complete this change, some of the helpers and utilities used by Entity filtering functionality
(ex: `useEntityListProvider`) needed to be updated to account for the possibility of an array of filter records.

### Updating Consumers

If consumers have implemented functionality that calls the `getCatalogFilters` method on `EntityFilter`s, this code will
need to be updated to account for the possibility of the method returning an array of records in addition to a single
record.

```typescript
const recordOrRecords = entityFilter.getCatalogFilters?.();
if (Array.isArray(recordOrRecords)) {
  // Handle the more complex array of records case.
} else {
  // Handle single record as before.
}
```
