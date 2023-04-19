---
'@backstage/plugin-catalog-backend': major
---

**BREAKING**: Relations, as returned through the `relations` field of entities in the catalog REST API responses, no longer have the `target` property. This property has been removed from the type system since #9972 in March 2022, but was kept around in the response shape until now for backwards compatibility reasons. Please use the `targetRef` field which is a full standard entity ref, instead of `target`.

```diff
-import {
-  Entity,
-  parseEntityRef,
-  stringifyEntityRef,
-} from '@backstage/catalog-model';
+import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

-    // TODO(freben): This is added as a compatibility guarantee, until we can be
-    // sure that all adopters have re-stitched their entities so that the new
-    // targetRef field is present on them, and that they have stopped consuming
-    // the now-removed old field
-    // TODO(jhaals): Remove this in April 2022
-    for (const entity of entities) {
-      if (entity.relations) {
-        for (const relation of entity.relations as any) {
-          if (!relation.targetRef && relation.target) {
-            // This is the case where an old-form entity, not yet stitched with
-            // the updated code, was in the database
-            relation.targetRef = stringifyEntityRef(relation.target);
-          } else if (!relation.target && relation.targetRef) {
-            // This is the case where a new-form entity, stitched with the
-            // updated code, was in the database but we still want to produce
-            // the old data shape as well for compatibility reasons
-            relation.target = parseEntityRef(relation.targetRef);
-          }
-        }
-      }
-    }
-
```

```diff
-    it.each(databases.eachSupportedId())(
-      'should return both target and targetRef for entities',
-      async databaseId => {
-        await createDatabase(databaseId);
-        await addEntity(
-          {
-            apiVersion: 'a',
-            kind: 'k',
-            metadata: { name: 'one' },
-            spec: {},
-            relations: [{ type: 'r', targetRef: 'x:y/z' } as any],
-          },
-          [],
-        );
-        await addEntity(
-          {
-            apiVersion: 'a',
-            kind: 'k',
-            metadata: { name: 'two' },
-            spec: {},
-            relations: [
-              {
-                type: 'r',
-                target: { kind: 'x', namespace: 'y', name: 'z' },
-              } as any,
-            ],
-          },
-          [],
-        );
-        const catalog = new DefaultEntitiesCatalog({
-          database: knex,
-          logger: getVoidLogger(),
-          stitcher,
-        });
-
-        const { entities } = await catalog.entities();
-
-        expect(
-          entities.find(e => e.metadata.name === 'one')!.relations,
-        ).toEqual([
-          {
-            type: 'r',
-            targetRef: 'x:y/z',
-            target: { kind: 'x', namespace: 'y', name: 'z' },
-          },
-        ]);
-        expect(
-          entities.find(e => e.metadata.name === 'two')!.relations,
-        ).toEqual([
-          {
-            type: 'r',
-            targetRef: 'x:y/z',
-            target: { kind: 'x', namespace: 'y', name: 'z' },
-          },
-        ]);
-      },
-    );
```
