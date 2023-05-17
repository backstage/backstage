# incident.io

Use this plugin to display on-going and historic incidents against Backstage
components, and to provide quick-links to open new incidents for that service
inside of incident.io.

## How it works

[importer]: https://github.com/incident/catalog-importer

Once you've configured the [catalog-importer][importer] to sync your Backstage
catalog into incident.io, you can visit your incident.io dashboard to create a
custom field that is powered by the Backstage Component catalog type.

We recommend creating a multi-select field called something like "Affected
services" or "Impacted components".

Remember the custom field ID (taken from the incident.io dashboard) as you'll
need it later.

## Install the plugin

The file paths mentioned in the following steps are relative to your app's root
directory — for example, the directory created by following the [Getting
Started](https://backstage.io/docs/getting-started/) guide and creating your app
with `npx @backstage/create-app`.

First, install the incident plugin via a CLI:

```bash
# From your Backstage app root directory
yarn add --cwd packages/app @backstage/plugin-incident
```

Next, add the plugin to `EntityPage.tsx` in
`packages/app/src/components/catalog` by adding the following code snippets.

Add the following imports to the top of the file:

```ts
import { EntityIncidentCard } from '@backstage/plugin-incident';
```

Find `const overviewContent` in `EntityPage.tsx`, and add the following snippet
inside the outermost `Grid` defined there, just before the closing `</Grid>`
tag:

```ts
<EntitySwitch>
  <EntitySwitch.Case if={isIncidentAvailable}>
    <Grid item md={6}>
      <EntityIncidentCard />
    </Grid>
  </EntitySwitch.Case>
</EntitySwitch>
```

When you're done, the `overviewContent` definition should look something like
this:

```ts
const overviewContent = (
  <Grid ...>
    ...
    <EntitySwitch>
      <EntitySwitch.Case if={isIncidentAvailable}>
        <Grid item md={6}>
          <EntityIncidentCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </Grid>
);
```

## Configure the plugin

[annotate]: https://backstage.io/docs/features/software-catalog/descriptor-format#annotations-optional

First, [annotate][annotate] the appropriate entity with the incident.io
integration key in its `.yaml` configuration file:

```yaml
annotations:
  incident.io/api-key: [API_KEY]
```

[api-keys]: https://app.incident.io/settings/api-keys/
[api-docs]: https://api-docs.incident.io/

Next, provide the [API key][api-keys] that the client will use to make requests
to the [incident.io API][api-docs].

Add the proxy configuration in `app-config.yaml`:

```yaml
proxy:
  ...
  '/incident/api':
    target: https://api.incident.io
    headers:
      Authorization: Bearer ${INCIDENT_API_KEY}
```

Finally, for any of the custom fields you've configured in incident that are
powered by Backstage catalog types, fill out the following `app-config.yaml`:

```yaml
integrations:
  incident:
    api-field: '<id-of-api-custom-field>'
    component-field: '<id-of-component-custom-field>'
    system-field: '<id-of-system-custom-field>'
    domain-field: '<id-of-domain-custom-field>'
```
