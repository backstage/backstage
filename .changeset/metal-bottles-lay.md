---
'@backstage/create-app': patch
---

Replaced EntitySystemDiagramCard with EntityCatalogGraphCard

To make this change to an existing app:

`yarn add @backstage/catalog-graph-plugin`

Apply the following changes to the `packages/app/src/components/catalog/EntityPage.tsx` file:

```diff
+ import {
+  Direction,
+  EntityCatalogGraphCard,
+ } from '@backstage/plugin-catalog-graph';
+ import {
+  RELATION_API_CONSUMED_BY,
+  RELATION_API_PROVIDED_BY,
+  RELATION_CONSUMES_API,
+  RELATION_DEPENDENCY_OF,
+  RELATION_DEPENDS_ON,
+  RELATION_HAS_PART,
+  RELATION_PART_OF,
+  RELATION_PROVIDES_API,
+ } from '@backstage/catalog-model';
```

`````diff
    <EntityLayout.Route path="/diagram" title="Diagram">
-      <EntitySystemDiagramCard />
+      <EntityCatalogGraphCard
+        variant="gridItem"
+        direction={Direction.TOP_BOTTOM}
+        title="System Diagram"
+        height={700}
+        relations={[
+          RELATION_PART_OF,
+          RELATION_HAS_PART,
+          RELATION_API_CONSUMED_BY,
+          RELATION_API_PROVIDED_BY,
+          RELATION_CONSUMES_API,
+          RELATION_PROVIDES_API,
+          RELATION_DEPENDENCY_OF,
+          RELATION_DEPENDS_ON,
+        ]}
+        unidirectional={false}
+      />
    </EntityLayout.Route>
    ````
`````
