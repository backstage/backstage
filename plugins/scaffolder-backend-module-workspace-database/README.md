# @backstage/plugin-scaffolder-backend-module-workspace-database

This module provides a database-backed workspace provider for the scaffolder backend.

**Warning:** This module is intended for development use only. In production, use an external storage provider like GCS (`@backstage/plugin-scaffolder-backend-module-gcp`).

## Installation

```bash
yarn add @backstage/plugin-scaffolder-backend-module-workspace-database
```

Add to your backend:

```typescript
// packages/backend/src/index.ts
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-workspace-database'),
);
```

Configure in your app-config:

```yaml
scaffolder:
  taskRecovery:
    enabled: true
    workspaceProvider: database
```

The module does not register the provider in production by default. Although it is not recommended, you can explicitly enable it with the following configuration:

```yaml
scaffolder:
  taskRecovery:
    database:
      dangerouslyEnableInProduction: true
```

## Limitations

- 5 MB maximum workspace size.
- Disabled in production unless you set `dangerouslyEnableInProduction` to `true`.
- Not recommended for high-volume or large workspace scenarios.
