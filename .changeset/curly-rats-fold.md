---
'@backstage/plugin-catalog-backend': patch
---

- Internal refactoring for performance in the service handlers

```diff
diff --git a/plugins/catalog-backend/src/service/DefaultEntitiesCatalog.ts b/plugins/catalog-backend/src/service/DefaultEntitiesCatalog.ts
index ba165f96af..2023c19e13 100644
--- a/plugins/catalog-backend/src/service/DefaultEntitiesCatalog.ts
+++ b/plugins/catalog-backend/src/service/DefaultEntitiesCatalog.ts
@@ -14,11 +14,7 @@
  * limitations under the License.
  */

-import {
-  Entity,
-  parseEntityRef,
-  stringifyEntityRef,
-} from '@backstage/catalog-model';
+import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
 import { InputError, NotFoundError } from '@backstage/errors';
 import { Knex } from 'knex';
 import { isEqual, chunk as lodashChunk } from 'lodash';
@@ -64,43 +60,47 @@ const defaultSortField: EntityOrder = {

 const DEFAULT_LIMIT = 20;

-function parsePagination(input?: EntityPagination): {
-  limit?: number;
-  offset?: number;
-} {
+function parsePagination(input?: EntityPagination): EntityPagination {
   if (!input) {
     return {};
   }

   let { limit, offset } = input;

-  if (input.after !== undefined) {
-    let cursor;
-    try {
-      const json = Buffer.from(input.after, 'base64').toString('utf8');
-      cursor = JSON.parse(json);
-    } catch {
-      throw new InputError('Malformed after cursor, could not be parsed');
-    }
-    if (cursor.limit !== undefined) {
-      if (!Number.isInteger(cursor.limit)) {
-        throw new InputError('Malformed after cursor, limit was not an number');
-      }
-      limit = cursor.limit;
+  if (input.after === undefined) {
+    return { limit, offset };
+  }
+
+  let cursor;
+  try {
+    const json = Buffer.from(input.after, 'base64').toString('utf8');
+    cursor = JSON.parse(json);
+  } catch {
+    throw new InputError('Malformed after cursor, could not be parsed');
+  }
+
+  if (cursor.limit !== undefined) {
+    if (!Number.isInteger(cursor.limit)) {
+      throw new InputError('Malformed after cursor, limit was not an number');
     }
-    if (cursor.offset !== undefined) {
-      if (!Number.isInteger(cursor.offset)) {
-        throw new InputError('Malformed after cursor, offset was not a number');
-      }
-      offset = cursor.offset;
+    limit = cursor.limit;
+  }
+
+  if (cursor.offset !== undefined) {
+    if (!Number.isInteger(cursor.offset)) {
+      throw new InputError('Malformed after cursor, offset was not a number');
     }
+    offset = cursor.offset;
   }

   return { limit, offset };
 }

-function stringifyPagination(input: { limit: number; offset: number }) {
-  const json = JSON.stringify({ limit: input.limit, offset: input.offset });
+function stringifyPagination(
+  input: Required<Omit<EntityPagination, 'after'>>,
+): string {
+  const { limit, offset } = input;
+  const json = JSON.stringify({ limit, offset });
   const base64 = Buffer.from(json, 'utf8').toString('base64');
   return base64;
 }
@@ -111,24 +111,21 @@ function addCondition(
   filter: EntitiesSearchFilter,
   negate: boolean = false,
   entityIdField = 'entity_id',
-) {
+): void {
+  const key = filter.key.toLowerCase();
+  const values = filter.values?.map(v => v.toLowerCase());
+
   // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
   // make a lot of sense. However, it had abysmal performance on sqlite
   // when datasets grew large, so we're using IN instead.
   const matchQuery = db<DbSearchRow>('search')
     .select('search.entity_id')
-    .where({ key: filter.key.toLowerCase() })
+    .where({ key })
     .andWhere(function keyFilter() {
-      if (filter.values) {
-        if (filter.values.length === 1) {
-          this.where({ value: filter.values[0].toLowerCase() });
-        } else {
-          this.andWhere(
-            'value',
-            'in',
-            filter.values.map(v => v.toLowerCase()),
-          );
-        }
+      if (values?.length === 1) {
+        this.where({ value: values.at(0) });
+      } else if (values) {
+        this.andWhere('value', 'in', values);
       }
     });
   queryBuilder.andWhere(entityIdField, negate ? 'not in' : 'in', matchQuery);
@@ -159,16 +156,16 @@ function parseFilter(
   negate: boolean = false,
   entityIdField = 'entity_id',
 ): Knex.QueryBuilder {
+  if (isNegationEntityFilter(filter)) {
+    return parseFilter(filter.not, query, db, !negate, entityIdField);
+  }
+
   if (isEntitiesSearchFilter(filter)) {
     return query.andWhere(function filterFunction() {
       addCondition(this, db, filter, negate, entityIdField);
     });
   }

-  if (isNegationEntityFilter(filter)) {
-    return parseFilter(filter.not, query, db, !negate, entityIdField);
-  }
-
   return query[negate ? 'andWhereNot' : 'andWhere'](function filterFunction() {
     if (isOrEntityFilter(filter)) {
       for (const subFilter of filter.anyOf ?? []) {
```
