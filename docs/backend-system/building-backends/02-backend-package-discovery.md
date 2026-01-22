---
id: backend-package-discovery
title: Backend Package Discovery
sidebar_label: Backend Package Discovery
description: Automatically discover and load backend plugins from package.json dependencies
---

The backend package discovery feature loader automatically discovers and loads backend plugins and modules from your backend's `package.json` dependencies. This eliminates the need to manually add each plugin with `backend.add()`, making it easier to manage large backends and enabling dynamic plugin loading based on configuration.

:::note Note

Using the discovery feature loader is **opt-in**. You can continue using manual `backend.add()` calls or custom feature loaders. Using the discovery feature loader may become the default for new backends in a future Backstage release.

:::

## How It Works

The discovery loader scans your backend's dependencies defined in your package.json and automatically loads packages that match the Backstage naming convention and have the correct metadata.

Packages must follow the Backstage naming convention to be discovered. Backend plugins must end with `-backend` (e.g., `@backstage/plugin-catalog-backend`), and backend modules must contain `-backend-module-` (e.g., `@backstage/plugin-catalog-backend-module-github`). Packages that don't match this convention are automatically ignored.

Each package must also have the correct `backstage.role` metadata in its `package.json`. Valid roles are `backend-plugin` for plugins and `backend-plugin-module` for modules. See the [package metadata documentation](../../tooling/package-metadata.md) for more details on package naming and metadata requirements.

## Setup

To enable the discovery feature loader, add it to your backend's `src/index.ts`:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { discoveryFeatureLoader } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(discoveryFeatureLoader);
backend.start();
```

Then configure which packages to discover in your `app-config.yaml`. The simplest approach is to load all backend packages:

```yaml
backend:
  packages: all
```

## Configuration

The `backend.packages` configuration controls which packages are discovered and loaded. When set to `all`, the loader discovers and loads all packages matching the naming convention and metadata requirements.

For more control, you can use the `include` and `exclude` options to filter specific packages:

```yaml
backend:
  packages:
    include:
      - '@backstage/plugin-catalog-backend'
      - '@backstage/plugin-search-backend'
    exclude:
      - '@backstage/plugin-auth-backend'
```

When `include` is specified, only the listed packages are considered for discovery, though they must still match the naming convention. If `include` is not specified, all dependencies are considered.

The `exclude` option is always applied after `include`, removing packages from the final list.

## Excluding Packages

Some packages provide modules that you may want to load manually with custom configuration or conditionally. For example, authentication provider modules are typically loaded alongside the main auth backend plugin, but you might want to load them conditionally or with custom setup.

To handle this, you can exclude specific modules from discovery while still allowing the main plugin to be discovered. The simplest approach is to use the `exclude` option in your configuration:

```yaml
backend:
  packages:
    exclude:
      - '@backstage/plugin-auth-backend-module-guest-provider'
```

For modules that are always excluded regardless of environment, use `discoveryFeatureLoaderFactory` with `alwaysExcludedPackages`:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { discoveryFeatureLoaderFactory } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(
  discoveryFeatureLoaderFactory({
    alwaysExcludedPackages: [
      '@backstage/plugin-auth-backend-module-guest-provider',
    ],
  }),
);

if (process.env.NODE_ENV === 'development') {
  backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
}

backend.start();
```

The `alwaysExcludedPackages` option is also useful for packages that are loaded conditionally in code, preventing conflicts with packages that use extension points, or keeping certain exclusions consistent across all environments without duplicating configuration.

:::warning Warning

The backend will fail to start if the same plugin entrypoint is added twice. If a package is discovered automatically, you must exclude it from discovery before manually adding a custom entrypoint from that package.

:::

## Troubleshooting

If some plugins are not loaded:

- Check that `backend.packages` is set in your configuration
- Verify that package names match the naming convention
- Ensure packages have the correct `backstage.role` metadata
- Check the backend logs for discovery messages.

If you encounter errors about plugins being added twice or duplicate entrypoints, the same plugin entrypoint is being loaded both by discovery and manually. Exclude the package from discovery using `backend.packages.exclude` or `alwaysExcludedPackages` before manually adding a custom entrypoint from that package.

## Related Documentation

- [Feature Loaders](../architecture/07-feature-loaders.md) - Learn about feature loaders in general
- [Package Metadata](../../tooling/package-metadata.md) - Package naming and metadata requirements
- [Building Backends](./01-index.md) - Overview of backend customization options
