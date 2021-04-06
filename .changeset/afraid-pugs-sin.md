---
'@backstage/create-app': minor
---

Only show relevant tabs.

For organizations that have a lot of plugins, some teams may want to utilize plugins that others find to be a distraction on their pages.

The CI/CD switcher is a good pattern, but it still forces all entities of a type to have a tab that implements each category the entire organization has agreed upon.

With this change, the default EntityPage will only show the tabs that are applicable for the Entity based on its annotations, providing more control to implementing teams on how they want their Entity to look.

```diff
diff --git a/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx b/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx
index d05f6bfa8..5fafaff59 100644
--- a/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx
+++ b/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx
@@ -14,7 +14,7 @@
  * limitations under the License.
  */
 import React from 'react';
-import { Button, Grid } from '@material-ui/core';
+import { Grid } from '@material-ui/core';
 import {
   ApiEntity,
   DomainEntity,
@@ -23,7 +23,6 @@ import {
   SystemEntity,
   UserEntity,
 } from '@backstage/catalog-model';
-import { EmptyState } from '@backstage/core';
 import {
   ApiDefinitionCard,
   ConsumedApisCard,
@@ -51,252 +50,228 @@ import {
 } from '@backstage/plugin-org';
 import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';

+interface ComponentType {
+  path: string;
+  title: string;
+  isApplicable(entity: Entity): boolean;
+  content(entity: Entity): JSX.Element;
+}

-const CICDSwitcher = ({ entity }: { entity: Entity }) => {
-  // This component is just an example of how you can implement your company's logic in entity page.
-  // You can for example enforce that all components of type 'service' should use GitHubActions
-  switch (true) {
-    case isGitHubActionsAvailable(entity):
-      return <GitHubActionsRouter entity={entity} />;
-    default:
-      return (
-        <EmptyState
-          title="No CI/CD available for this entity"
-          missing="info"
-          description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below."
-          action={
-            <Button
-              variant="contained"
-              color="primary"
-              href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
-            >
-              Read more
-            </Button>
-          }
-        />
-      );
-  }
-};
-
-const OverviewContent = ({ entity }: { entity: Entity }) => (
-  <Grid container spacing={3} alignItems="stretch">
-    <Grid item md={6}>
-      <AboutCard entity={entity} variant="gridItem" />
-    </Grid>
-  </Grid>
-);
-
-const ComponentApisContent = ({ entity }: { entity: Entity }) => (
-  <Grid container spacing={3} alignItems="stretch">
-    <Grid item md={6}>
-      <ProvidedApisCard entity={entity} />
-    </Grid>
-    <Grid item md={6}>
-      <ConsumedApisCard entity={entity} />
+const Overview: ComponentType = {
+  path: '/',
+  title: 'Overview',
+  isApplicable: (_entity: Entity) => true,
+  content: (entity: Entity): JSX.Element => (
+    <Grid container spacing={3} alignItems="stretch">
+      <Grid item md={12}>
+        <AboutCard entity={entity} variant="gridItem" />
+      </Grid>
     </Grid>
-  </Grid>
-);
-
-const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/"
-      title="Overview"
-      element={<OverviewContent entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/ci-cd/*"
-      title="CI/CD"
-      element={<CICDSwitcher entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/api/*"
-      title="API"
-      element={<ComponentApisContent entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/docs/*"
-      title="Docs"
-      element={<DocsRouter entity={entity} />}
-    />
-  </EntityPageLayout>
-);
-
-const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/"
-      title="Overview"
-      element={<OverviewContent entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/ci-cd/*"
-      title="CI/CD"
-      element={<CICDSwitcher entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/docs/*"
-      title="Docs"
-      element={<DocsRouter entity={entity} />}
-    />
-  </EntityPageLayout>
-);
-
-const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/*"
-      title="Overview"
-      element={<OverviewContent entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/docs/*"
-      title="Docs"
-      element={<DocsRouter entity={entity} />}
-    />
-  </EntityPageLayout>
-);
+  ),
+};

-export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
-  switch (entity?.spec?.type) {
-    case 'service':
-      return <ServiceEntityPage entity={entity} />;
-    case 'website':
-      return <WebsiteEntityPage entity={entity} />;
-    default:
-      return <DefaultEntityPage entity={entity} />;
-  }
+const Docs: ComponentType = {
+  path: '/docs/*',
+  title: 'Docs',
+  isApplicable: entity =>
+    Boolean(entity?.metadata.annotations?.['backstage.io/techdocs-ref']),
+  content: entity => <DocsRouter entity={entity} />,
 };

-const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
-  <Grid container spacing={3}>
-    <Grid item md={6}>
-      <AboutCard entity={entity} />
-    </Grid>
-    <Grid container item md={12}>
+const ComponentApis: ComponentType = {
+  path: '/api/*',
+  title: 'API',
+  isApplicable: entity =>
+  Boolean(entity?.spec?.providesApis || entity?.spec?.consumesApis),
+  content: entity => (
+    <Grid container spacing={3} alignItems="stretch">
       <Grid item md={6}>
-        <ProvidingComponentsCard entity={entity} />
+        <ProvidedApisCard entity={entity} />
       </Grid>
       <Grid item md={6}>
-        <ConsumingComponentsCard entity={entity} />
+        <ConsumedApisCard entity={entity} />
       </Grid>
     </Grid>
-  </Grid>
-);
+  ),
+};

-const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
-  <Grid container spacing={3}>
-    <Grid item xs={12}>
-      <ApiDefinitionCard apiEntity={entity} />
+const CICD: ComponentType = {
+  // This component is just an example of how you can implement your company's logic in entity page.
+  // You can for example enforce that all components of type 'service' should use GitHubActions
+  path: '/ci-cd/*',
+  title: 'CI/CD',
+  isApplicable: entity =>
+  isGitHubActionsAvailable(entity),
+  content: entity => {
+    switch (true) {
+      case isGitHubActionsAvailable(entity):
+        return <GitHubActionsRouter entity={entity} />;
+      default:
+        return <></>;
+    }
+  },
+};
+
+const ApiOverview: ComponentType = {
+  path: '/*',
+  title: 'Overview',
+  isApplicable: (entity: ApiEntity) => entity?.kind === 'API',
+  content: (entity: ApiEntity) => (
+    <Grid container spacing={3}>
+      <Grid item md={6}>
+        <AboutCard entity={entity} />
+      </Grid>
+      <Grid container item md={12}>
+        <Grid item md={6}>
+          <ProvidingComponentsCard entity={entity} />
+        </Grid>
+        <Grid item md={6}>
+          <ConsumingComponentsCard entity={entity} />
+        </Grid>
+      </Grid>
     </Grid>
-  </Grid>
-);
-
-const ApiEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/*"
-      title="Overview"
-      element={<ApiOverviewContent entity={entity} />}
-    />
-    <EntityPageLayout.Content
-      path="/definition/*"
-      title="Definition"
-      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
-    />
-  </EntityPageLayout>
-);
-
-const UserOverviewContent = ({ entity }: { entity: UserEntity }) => (
-  <Grid container spacing={3}>
-    <Grid item xs={12} md={6}>
-      <UserProfileCard entity={entity} variant="gridItem" />
+  ),
+};
+
+const ApiDefinition: ComponentType = {
+  path: '/definition/*',
+  title: 'Definition',
+  isApplicable: (entity: ApiEntity) => entity?.kind === 'API',
+  content: (entity: ApiEntity) => (
+    <Grid container spacing={3}>
+      <Grid item xs={12}>
+        <ApiDefinitionCard apiEntity={entity} />
+      </Grid>
     </Grid>
-    <Grid item xs={12} md={6}>
-      <OwnershipCard entity={entity} variant="gridItem" />
+  ),
+};
+
+const UserOverview: ComponentType = {
+  path: '/*',
+  title: 'Overview',
+  isApplicable: (entity: UserEntity) => entity?.kind === 'User',
+  content: (entity: UserEntity) => (
+    <Grid container spacing={3}>
+      <Grid item xs={12} md={6}>
+        <UserProfileCard entity={entity} variant="gridItem" />
+      </Grid>
+      <Grid item xs={12} md={6}>
+        <OwnershipCard entity={entity} variant="gridItem" />
+      </Grid>
     </Grid>
-  </Grid>
-);
-
-const UserEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/*"
-      title="Overview"
-      element={<UserOverviewContent entity={entity as UserEntity} />}
-    />
-  </EntityPageLayout>
-);
+  ),
+};

-const GroupOverviewContent = ({ entity }: { entity: GroupEntity }) => (
-  <Grid container spacing={3}>
-    <Grid item xs={12} md={6}>
-      <GroupProfileCard entity={entity} variant="gridItem" />
-    </Grid>
-    <Grid item xs={12} md={6}>
-      <OwnershipCard entity={entity} variant="gridItem" />
-    </Grid>
-    <Grid item xs={12}>
-      <MembersListCard entity={entity} />
+const GroupOverview: ComponentType = {
+  path: '/*',
+  title: 'Overview',
+  isApplicable: (entity: GroupEntity) => entity?.kind === 'Group',
+  content: (entity: GroupEntity) => (
+    <Grid container spacing={3}>
+      <Grid item xs={12} md={6}>
+        <GroupProfileCard entity={entity} variant="gridItem" />
+      </Grid>
+      <Grid item xs={12} md={6}>
+        <OwnershipCard entity={entity} variant="gridItem" />
+      </Grid>
+      <Grid item xs={12}>
+        <MembersListCard entity={entity} />
+      </Grid>
     </Grid>
-  </Grid>
-);
+  ),
+};

-const GroupEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/*"
-      title="Overview"
-      element={<GroupOverviewContent entity={entity as GroupEntity} />}
-    />
-  </EntityPageLayout>
-);

-const SystemOverviewContent = ({ entity }: { entity: SystemEntity }) => (
-  <Grid container spacing={3} alignItems="stretch">
-    <Grid item md={6}>
-      <AboutCard entity={entity} variant="gridItem" />
-    </Grid>
-    <Grid item md={6}>
-      <EntityHasComponentsCard variant="gridItem" />
-    </Grid>
-    <Grid item md={6}>
-      <EntityHasApisCard variant="gridItem" />
+const SystemOverview: ComponentType = {
+  path: '/*',
+  title: 'Overview',
+  isApplicable: (entity: SystemEntity) => entity?.kind === 'System',
+  content: (entity: SystemEntity) => (
+    <Grid container spacing={3} alignItems="stretch">
+      <Grid item md={6}>
+        <AboutCard entity={entity} variant="gridItem" />
+      </Grid>
+      <Grid item md={6}>
+        <EntityHasComponentsCard variant="gridItem" />
+      </Grid>
+      <Grid item md={6}>
+        <EntityHasApisCard variant="gridItem" />
+      </Grid>
     </Grid>
-  </Grid>
-);
+  ),
+};

-const SystemEntityPage = ({ entity }: { entity: Entity }) => (
-  <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/*"
-      title="Overview"
-      element={<SystemOverviewContent entity={entity as SystemEntity} />}
-    />
-  </EntityPageLayout>
-);

-const DomainOverviewContent = ({ entity }: { entity: DomainEntity }) => (
-  <Grid container spacing={3} alignItems="stretch">
-    <Grid item md={6}>
-      <AboutCard entity={entity} variant="gridItem" />
-    </Grid>
-    <Grid item md={6}>
-      <EntityHasSystemsCard variant="gridItem" />
+const DomainOverview: ComponentType = {
+  path: '/*',
+  title: 'Overview',
+  isApplicable: (entity: DomainEntity) => entity?.kind === 'Domain',
+  content: (entity: DomainEntity) => (
+    <Grid container spacing={3} alignItems="stretch">
+      <Grid item md={6}>
+        <AboutCard entity={entity} variant="gridItem" />
+      </Grid>
+      <Grid item md={6}>
+        <EntityHasSystemsCard variant="gridItem" />
+      </Grid>
     </Grid>
-  </Grid>
-);
+  ),
+};

-const DomainEntityPage = ({ entity }: { entity: Entity }) => (
+interface ComponentMap {
+  [key: string]: ComponentType[];
+}
+
+const COMPONENT_MAP: ComponentMap = {
+  default: [Overview, Docs],
+  service: [Overview, CICD, ComponentApis, Docs],
+  website: [Overview, CICD, Docs],
+  api: [ApiOverview, ApiDefinition],
+  user: [UserOverview],
+  group: [GroupOverview],
+  system: [SystemOverview],
+  domain: [DomainOverview],
+  docs: [
+    Object.assign({}, Docs, { path: '/*' }),
+    Object.assign({}, Overview, { path: '/about' }),
+  ],
+};
+
+const Page = ({
+  entity,
+  components,
+}: {
+  entity: Entity;
+  components: ComponentType[];
+}) => (
   <EntityPageLayout>
-    <EntityPageLayout.Content
-      path="/*"
-      title="Overview"
-      element={<DomainOverviewContent entity={entity as DomainEntity} />}
-    />
-  </EntityPageLayout>
+    {components
+      .map(c =>
+        entity && c.isApplicable(entity) ? (
+          <EntityPageLayout.Content
+            path={c.path}
+            title={c.title}
+            element={c.content(entity)}
+          />
+        ) : (
+          void 1
+        ),
+      )
+      .filter(c => c)}
+      </EntityPageLayout>
 );

+export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
+  switch (entity?.spec?.type) {
+    case 'service':
+      return <Page entity={entity} components={COMPONENT_MAP.service} />;
+    case 'website':
+      return <Page entity={entity} components={COMPONENT_MAP.website} />;
+    default:
+      return <Page entity={entity} components={COMPONENT_MAP.default} />;
+  }
+};
+
 export const EntityPage = () => {
   const { entity } = useEntity();

@@ -304,19 +279,19 @@ export const EntityPage = () => {
     case 'component':
       return <ComponentEntityPage entity={entity} />;
     case 'api':
-      return <ApiEntityPage entity={entity} />;
+      return <Page entity={entity} components={COMPONENT_MAP.api} />;
     case 'group':
-      return <GroupEntityPage entity={entity} />;
+      return <Page entity={entity} components={COMPONENT_MAP.group} />;
     case 'user':
-      return <UserEntityPage entity={entity} />;
+      return <Page entity={entity} components={COMPONENT_MAP.user} />;
     case 'system':
-      return <SystemEntityPage entity={entity} />;
+      return <Page entity={entity} components={COMPONENT_MAP.system} />;
     case 'domain':
-      return <DomainEntityPage entity={entity} />;
+      return <Page entity={entity} components={COMPONENT_MAP.domain} />;
     case 'location':
     case 'resource':
     case 'template':
     default:
-      return <DefaultEntityPage entity={entity} />;
+      return <Page entity={entity} components={COMPONENT_MAP.default} />;
   }
 };

```
