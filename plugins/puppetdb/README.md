# PuppetDB Plugin

A frontend plugin to integrate PuppetDB with Backstage. When combined with the
[catalog-backend-module-puppetdb](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-puppetdb/README.md) plugin, this
frontend plugin allows viewing PuppetDB reports, including their logs and events, of Backstage resource entities.

![Reports list](https://raw.githubusercontent.com/backstage/backstage/42b65232e763d3e39e2e641b105d2ad469db7a59/plugins/puppetdb/assets/Reports.png)

## Getting started

To get started, you need a running instance of PuppetDB. You can find instructions on how to install it
[here](https://www.puppet.com/docs/puppetdb/7/install_via_module.html).

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
