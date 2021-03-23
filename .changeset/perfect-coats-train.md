---
'@backstage/plugin-catalog': patch
---

Adds a new `EntitySystemDiagramCard` component to visually map all elements in a system.

To use this new component with the legacy composability pattern, you can add a new tab with the component on to the System Entity Page in your `packages/app/src/components/catalog/EntityPage.tsx` file.

For example,

```diff
 const SystemEntityPage = ({ entity }: { entity: Entity }) => (
   <EntityPageLayout>
     <EntityPageLayout.Content
       path="/*"
       title="Overview"
       element={<SystemOverviewContent entity={entity} />}
     />
+    <EntityPageLayout.Content
+      path="/diagram/*"
+      title="Diagram"
+      element={<EntitySystemDiagramCard entity={entity} />}
+    />
   </EntityPageLayout>
 );
```
