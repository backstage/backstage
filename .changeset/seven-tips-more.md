---
'@backstage/create-app': patch
---

Adjust template to the latest changes in the `api-docs` plugin.

## Template Changes

While updating to the latest `api-docs` plugin, the following changes are necessary for the `create-app` template in your `app/src/components/catalog/EntityPage.tsx`. This adds:

- A custom entity page for API entities
- Changes the API tab to include the new `ConsumedApisCard` and `ProvidedApisCard` that link to the API entity.

```diff
 import {
+  ApiDefinitionCard,
-  Router as ApiDocsRouter,
+  ConsumedApisCard,
+  ProvidedApisCard,
+  ConsumedApisCard,
+  ConsumingComponentsCard,
+  ProvidedApisCard,
+  ProvidingComponentsCard
 } from '@backstage/plugin-api-docs';

...

+const ComponentApisContent = ({ entity }: { entity: Entity }) => (
+  <Grid container spacing={3} alignItems="stretch">
+    <Grid item md={6}>
+      <ProvidedApisCard entity={entity} />
+    </Grid>
+    <Grid item md={6}>
+      <ConsumedApisCard entity={entity} />
+    </Grid>
+  </Grid>
+);

 const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
   <EntityPageLayout>
     <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/api/*"
      title="API"
-     element={<ApiDocsRouter entity={entity} />}
+     element={<ComponentApisContent entity={entity} />}
    />
...

-export const EntityPage = () => {
-  const { entity } = useEntity();
-  switch (entity?.spec?.type) {
-    case 'service':
-      return <ServiceEntityPage entity={entity} />;
-    case 'website':
-      return <WebsiteEntityPage entity={entity} />;
-    default:
-      return <DefaultEntityPage entity={entity} />;
-  }
-};

+export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
+  switch (entity?.spec?.type) {
+    case 'service':
+      return <ServiceEntityPage entity={entity} />;
+    case 'website':
+      return <WebsiteEntityPage entity={entity} />;
+    default:
+      return <DefaultEntityPage entity={entity} />;
+  }
+};
+
+const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
+  <Grid container spacing={3}>
+    <Grid item md={6}>
+      <AboutCard entity={entity} />
+    </Grid>
+    <Grid container item md={12}>
+      <Grid item md={6}>
+        <ProvidingComponentsCard entity={entity} />
+      </Grid>
+      <Grid item md={6}>
+        <ConsumingComponentsCard entity={entity} />
+      </Grid>
+    </Grid>
+  </Grid>
+);
+
+const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
+  <Grid container spacing={3}>
+    <Grid item xs={12}>
+      <ApiDefinitionCard apiEntity={entity} />
+    </Grid>
+  </Grid>
+);
+
+const ApiEntityPage = ({ entity }: { entity: Entity }) => (
+  <EntityPageLayout>
+    <EntityPageLayout.Content
+      path="/*"
+      title="Overview"
+      element={<ApiOverviewContent entity={entity} />}
+    />
+    <EntityPageLayout.Content
+      path="/definition/*"
+      title="Definition"
+      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
+    />
+  </EntityPageLayout>
+);
+
+export const EntityPage = () => {
+  const { entity } = useEntity();
+
+  switch (entity?.kind?.toLowerCase()) {
+    case 'component':
+      return <ComponentEntityPage entity={entity} />;
+    case 'api':
+      return <ApiEntityPage entity={entity} />;
+    default:
+      return <DefaultEntityPage entity={entity} />;
+  }
+};
```
