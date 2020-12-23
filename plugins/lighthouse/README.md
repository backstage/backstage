# @backstage/plugin-lighthouse

A frontend for [lighthouse-audit-service](https://github.com/spotify/lighthouse-audit-service), this plugin allows you to trigger Lighthouse audits on websites and track them over time.

## Getting Started

### Use cases

Google's [Lighthouse](https://developers.google.com/web/tools/lighthouse) auditing tool for websites
is a great open-source resource for benchmarking and improving the accessibility, performance, SEO, and best practices of your site.
At Spotify, we keep track of Lighthouse audit scores over time to look at trends and overall areas for investment.

This plugin allows you to generate on-demand Lighthouse audits for websites, and to track the trends for the
top-level categories of Lighthouse at a glance.

In the future, we hope to add support for scheduling audits (which we do internally), as well as allowing
custom runs of Lighthouse to be ingested (for auditing sites that require authentication or some session state).

### Installation

To get started, you will need a running instance of [lighthouse-audit-service](https://github.com/spotify/lighthouse-audit-service).
_It's likely you will need to enable CORS when running lighthouse-audit-service. Initialize the app
with the environment variable `LAS_CORS` set to `true`._

When you have an instance running that Backstage can hook into, make sure to export the plugin in
your app's [`plugins.ts`](https://github.com/backstage/backstage/blob/master/packages/app/src/plugins.ts)
to enable the plugin:

```js
export { plugin as LighthousePlugin } from '@backstage/plugin-lighthouse';
```

Modify your app routes to include the Router component exported from the plugin, for example:

```tsx
import { Router as LighthouseRouter } from '@backstage/plugin-lighthouse';

// Inside App component
<Routes>
  // ...
  <Route path="/lighthouse/*" element={<LighthouseRouter />} />
  // ...
</Routes>;
```

Then configure the lighthouse service url in your [`app-config.yaml`](https://github.com/backstage/backstage/blob/master/app-config.yaml).

```yaml
lighthouse:
  baseUrl: http://your-service-url
```

### Integration with the Catalog

The lighthouse plugin can be integrated into the catalog so that lighthouse audit information relating to a component
can be displayed within that component's entity page. In order to link an Entity to its lighthouse audits the entity
must be annotated as follows:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    # ...
    lighthouse.com/website-url: # A single website url e.g. https://backstage.io/
```

> NOTE: The lighthouse plugin only supports one website URL per component at this time.

Add a lighthouse tab to the EntityPage:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import { EmbeddedRouter as LighthouseRouter } from '@backstage/plugin-lighthouse';

// ...
const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    // ...
    <EntityPageLayout.Content
      path="/lighthouse/*"
      title="Lighthouse"
      element={<LighthouseRouter entity={entity} />}
    />
  </EntityPageLayout>
);
```

> NOTE: The embedded router renders page content without a header section allowing it to be rendered within a
> catalog plugin page.

Add a Lighthouse card to the overview tab on the EntityPage:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import {
  LastLighthouseAuditCard,
  isPluginApplicableToEntity as isLighthouseAvailable,
} from '@backstage/plugin-lighthouse';

// ...

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    // ...
    {isLighthouseAvailable(entity) && (
      <Grid item sm={4}>
        <LastLighthouseAuditCard />
      </Grid>
    )}
  </Grid>
);
```
