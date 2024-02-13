# code-coverage

This is the frontend part of the code-coverage plugin. It displays code coverage summaries for your entities.

## Installation

```sh
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-code-coverage
```

Finally you need to import and render the code coverage entity, in `packages/app/src/components/catalog/EntityPage.tsx` add the following:

```diff
@@ -70,6 +70,7 @@ import {

 import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
 import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
+import { EntityCodeCoverageContent } from '@backstage/plugin-code-coverage';

@@ -226,6 +227,10 @@ const defaultEntityPage = (
     <EntityLayout.Route path="/docs" title="Docs">
       {techdocsContent}
     </EntityLayout.Route>
+
+    <EntityLayout.Route path="/code-coverage" title="Code Coverage">
+      <EntityCodeCoverageContent />
+    </EntityLayout.Route>
   </EntityLayout>
 );
```

## Configuring your entity

In order to use this plugin, you must set the `backstage.io/code-coverage` annotation on entities for which coverage ingestion has been enabled.

```yaml
metadata:
  annotations:
    backstage.io/code-coverage: enabled
```

There's a feature to only include files that are in VCS in the coverage report, this is helpful to not count generated files for example. To enable this set the `backstage.io/code-coverage` annotation to `scm-only`.

```yaml
metadata:
  annotations:
    backstage.io/code-coverage: scm-only
```

Note: It may be required to set the [`backstage.io/source-location` annotation](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiosource-location), however this should generally not be needed.
