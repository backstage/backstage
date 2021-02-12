---
'@backstage/plugin-catalog': patch
---

Adds a new `SystemDiagram` component to mvisually map all elements in a system.

To use this new component, a new system entity page would need to be added to the `packages/app/src/components/catalog/EntityPage.tsx` file.

For example,

```tsx
const SystemOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item xs={12} md={8}>
      <SystemDiagram entity={entity} />
    </Grid>
  </Grid>
);

const SystemEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<SystemOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);
```

And the addition of a new switch case to the `EntityPage`:

```diff
-export const EntityPage = () => {
-  const { entity } = useEntity();
-
-  switch (entity?.kind?.toLowerCase()) {
-    case 'component':
-      return <ComponentEntityPage entity={entity} />;
-    case 'api':
-      return <ApiEntityPage entity={entity} />;
-    case 'group':
-      return <GroupEntityPage entity={entity} />;
-    case 'user':
-      return <UserEntityPage entity={entity} />;
+    case 'system':
+      return <SystemEntityPage entity={entity} />;
-    default:
-      return <DefaultEntityPage entity={entity} />;
-  }
-};
```
