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

## Limitations

- 5MB maximum workspace size
- Logs a warning when used in production environments
- Not recommended for high-volume or large workspace scenarios
