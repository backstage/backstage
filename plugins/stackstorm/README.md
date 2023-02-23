# StackStorm Plugin

Welcome to the StackStorm plugin!

A Backstage integration for the [StackStorm](https://docs.stackstorm.com/overview.html).
This plugin allows you to display a list of executions, view execution details,
browse installed packs, actions and more.

## Getting started

To get started, first you need a running instance of StackStorm.
One of the quickest ways is [running StackStorm with Docker](https://docs.stackstorm.com/install/docker.html).

### Installation

1. Install the plugin with `yarn` in the root of your Backstage directory

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-stackstorm
```

2. Import and use the plugin in `packages/app/src/App.tsx`

```tsx
import { StackstormPage } from '@backstage/plugin-stackstorm';

const routes = (
  <FlatRoutes>
    {/* ...other routes */}
    <Route path="/stackstorm" element={<StackstormPage />} />
  </FlatRoutes>
```

### Configuration

1. Configure `webUrl` for links to the StackStorm Web UI in `app-config.yaml`.

```yaml
stackstorm:
  webUrl: 'https://your.stackstorm.webui.com'
```

2. Configure `stackstorm` proxy
   This plugin uses the Backstage proxy to securely communicate with StackStorm API.
   Add the following to your `app-config.yaml` to enable this configuration:

```yaml
proxy:
  '/stackstorm':
    target: https://your.stackstorm.instance.com/api
    headers:
      St2-Api-Key: ${ST2_API_KEY}
```

In your production deployment of Backstage, you would also need to ensure that
you've set the `ST2_API_KEY` environment variable before starting
the backend.

Read more about how to find or generate this key in the
[StackStorm Authentication Documentation](https://docs.stackstorm.com/authentication.html#api-keys).
