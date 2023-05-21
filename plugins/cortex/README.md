# Cortex XDR Plugin

A frontend plugin to integrate Cortex XDR with Backstage. 
Plugin has main Cortex XDR Status card and Incidets/Alerts reports tables. 

## Getting started

### Prerequisites

To get started, you need a running instance of Cortex XDR. 
In addition, you need to ensure your Resource entities have `cortexxdr/hostname` annotation set. 

### Installation

1. Install the plugin with `yarn` in the root of your Backstage application directory:

```bash
yarn --cwd packages/app add @backstage/plugin-cortex
```

1. Import and use the plugin in `packages/app/src/App.tsx`:

```tsx
import { CortexPage } from '@backstage/plugin-cortex';

const routes = (
  <FlatRoutes>
    {/* ...other routes */}
    <Route path="/cortex" element={<CortexPage />} />
  </FlatRoutes>
);
```
## Configuration

1. Configure `cortex` proxy. As this plugin uses the Backstage proxy to securely communicate with Cortex XDR API,
   add the following to your `app-config.yaml` to enable this configuration:

```yaml
proxy:
  '/cortex':
    target: https://your.cortex.instance.com
```

1. You can set what resources will you the plugin. To do that add configuration to your `app-config.yaml`: 

```yaml
cortex: 
  allowedTypes: [servers]
```
