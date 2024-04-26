# periskop

[Periskop](https://periskop.io/) is a pull-based, language agnostic exception aggregator for microservice environments.

![periskop-logo](https://i.imgur.com/z8BLePO.png)

## Periskop aggregated errors

The Periskop Backstage Plugin exposes a component named `EntityPeriskopErrorsCard`.
Each of the entries in the table will direct you to the error details in your deployed Periskop instance location.

![periskop-errors-card](./docs/periskop-plugin-screenshot.png)

## Setup

1. Configure the [periskop backend plugin](https://github.com/backstage/backstage/tree/master/plugins/periskop-backend/)

2. Install the plugin by running:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-periskop
```

3. Add to the app `EntityPage` component:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityPeriskopErrorsCard } from '@backstage/plugin-periskop';

const componentPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route path="/periskop" title="Periskop">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} sm={12} md={12}>
          <EntityPeriskopErrorsCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
```

4. [Setup the `app-config.yaml`](#instances) `periskop` block

5. Annotate entities with the periskop service name

```yaml
annotations:
  periskop.io/service-name: '<THE NAME OF THE PERISKOP APP>'
```

6. Run app with `yarn start` and navigate to `/periskop` or a catalog entity 'Periskop' tab

### Instances

The periskop plugin can be configured to fetch aggregated errors from multiple deployment instances.
This is especially useful if you have a multi-zone deployment, or a federated setup and would like to drill deeper into a single instance of the federation. Each of the configured instances will be included in the plugin's UI via a dropdown on the errors table.

The plugin requires to configure _at least one_ Periskop API location in the [app-config.yaml](https://github.com/backstage/backstage/blob/master/app-config.yaml):

```yaml
periskop:
  instances:
    - name: <name of the instance>
      url: <HTTP/S url for the Periskop instance's API>
```
