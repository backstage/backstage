# Gateway Backend Plugin

A plugin for managing request routing in distributed Backstage deployments.

## Overview

This plugin is designed for organizations that have [split their backend plugins across multiple Backstage deployments](https://backstage.io/docs/backend-system/building-backends/index#split-into-multiple-backends) and implemented a custom Discovery service to resolve backend plugin URLs.

While a custom discovery service handles routing between backend plugins, it doesn't address frontend-to-backend routing without either:

- Hardcoding URLs in the frontend
- Implementing a custom reverse proxy

The Gateway Backend Plugin solves this by providing a centralized routing solution in a dedicated "gateway" Backstage deployment. It routes frontend requests to the appropriate backend plugins using the Discovery service, while prioritizing local plugins when available.

## Installation

1. Install the plugin package:

```bash
# From your root directory
yarn --cwd packages/backend add @backstage/plugin-gateway-backend
```

2. Add the plugin to your backend in `packages/backend/src/index.ts`:

```diff
  const backend = createBackend();
  // ...
+ backend.add(import('@backstage/plugin-gateway-backend'));
```

3. Configure the `baseUrl` in your `app-config.yaml` to point to your gateway deployment:

```yaml
backend:
  # The baseUrl of your gateway Backstage deployment
  baseUrl: http://gateway-backstage-backend.example.com
```
