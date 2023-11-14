# Google Cloud Build

### Welcome to the Google Cloud Build plugin!

This plugin allows you to include Google Cloud Build history in your backstage CI/CD page.

<img src="../../docs/assets/plugins/cloudbuild/CloudBuildPlugin.png">

## Installation Steps

### Install the plugin into backstage

```bash
cd packages/app
yarn add @backstage/plugin-cloudbuild
```

### Modify EntityPage.tsx

packages/app/src/components/catalog/EntityPage.tsx

#### Add the Plugin import to the list of imports

```diff
// packages/app/src/components/catalog/EntityPage.tsx
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';

import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';

+import { EntityCloudbuildContent, isCloudbuildAvailable } from '@backstage/plugin-cloudbuild';
```

#### In your `cicdContent` constant, add the following switch case

```diff
// packages/app/src/components/catalog/EntityPage.tsx
const cicdContent = (
  <EntitySwitch>
+    <EntitySwitch.Case if={isCloudbuildAvailable}>
+      <EntityCloudbuildContent />
+    </EntitySwitch.Case>

    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <EntityGithubActionsContent />
    </EntitySwitch.Case>
```

##### OPTIONAL

If you don't use GitHub Actions, or don't want to show it on your CI/CD page, then you can remove the switch case for it

```diff
// packages/app/src/components/catalog/EntityPage.tsx
const cicdContent = (
  <EntitySwitch>
+    <EntitySwitch.Case if={isCloudbuildAvailable}>
+      <EntityCloudbuildContent />
+    </EntitySwitch.Case>

-    <EntitySwitch.Case if={isGithubActionsAvailable}>
-      <EntityGithubActionsContent />
-    </EntitySwitch.Case>
```

### Add annotation to your component-info.yaml file.

Any component, that you would like the Cloud Build Plugin to populate for, should include the following annotation:

```diff
// component-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  description: Backstage application.
+  annotations:
+    google.com/cloudbuild-project-slug: your-project-name
spec:
  type: website
  lifecycle: development
```
