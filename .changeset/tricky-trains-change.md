---
'@backstage/core-components': patch
'@backstage/plugin-catalog': patch
'@backstage/create-app': patch
---

Added an `EntityProcessingErrorsPanel` component to show any errors that occurred when refreshing an entity from its source location.

If upgrading, this should be added to your `EntityPage` in your Backstage application:

```diff
// packages/app/src/components/catalog/EntityPage.tsx

const overviewContent = (
...
          <EntityOrphanWarning />
        </Grid>
       </EntitySwitch.Case>
    </EntitySwitch>
+   <EntitySwitch>
+     <EntitySwitch.Case if={hasCatalogProcessingErrors}>
+       <Grid item xs={12}>
+         <EntityProcessingErrorsPanel />
+       </Grid>
+     </EntitySwitch.Case>
+   </EntitySwitch>

```

Additionally, `WarningPanel` now changes color based on the provided severity.
