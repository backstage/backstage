# PuppetDB Plugin

A frontend plugin to integrate PuppetDB with Backstage. When combined with the
[catalog-backend-module-puppetdb](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-puppetdb/README.md) plugin, this
frontend plugin allows viewing PuppetDB reports, including their logs and events, of Backstage resource entities.

## Getting started

### Prerequisites

To get started, you need a running instance of PuppetDB. You can find instructions on how to install it
[here](https://www.puppet.com/docs/puppetdb/7/install_via_module.html).
The PuppetDB [should be configured](https://www.puppet.com/docs/puppetdb/7/configure.html#host) to allow being accessed from your Backstage instance.

In addition, your Backstage instance need to either have
[catalog-backend-module-puppetdb](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-puppetdb/README.md) plugin installed
or you need to ensure your Resource entities have `puppet.com/certname` annotation set to the PuppetDB node name in some other way.

### Installation

1. Install the plugin with `yarn` in the root of your Backstage application directory:

```bash
yarn --cwd packages/app add @backstage/plugin-puppetdb
```

1. Import and use the plugin in `packages/app/src/App.tsx`:

```tsx
import { PuppetDbPage } from '@backstage/plugin-puppetdb';

const routes = (
  <FlatRoutes>
    {/* ...other routes */}
    <Route path="/puppetdb" element={<PuppetDbPage />} />
  </FlatRoutes>
);
```

### Configuration

1. Configure `puppetdb` proxy. As this plugin uses the Backstage proxy to securely communicate with PuppetDB API,
   add the following to your `app-config.yaml` to enable this configuration:

```yaml
proxy:
  '/puppetdb':
    target: https://your.puppetdb.instance.com
```

## Screenshots

#### Main page with the reports list:

![Reports list](https://raw.githubusercontent.com/backstage/backstage/42b65232e763d3e39e2e641b105d2ad469db7a59/plugins/puppetdb/assets/Reports.png)

#### Events for the specific report:

![Events](https://raw.githubusercontent.com/backstage/backstage/1b39e86db17f139dc995f02daca4896533e53eb0/plugins/puppetdb/assets/Events.png)

#### Logs of the specific report:

![Logs](https://raw.githubusercontent.com/backstage/backstage/1b39e86db17f139dc995f02daca4896533e53eb0/plugins/puppetdb/assets/Logs.png)
