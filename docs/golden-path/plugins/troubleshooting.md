---
id: troubleshooting
title: Plugin Development Troubleshooting
sidebar_label: Troubleshooting
description: Common issues and solutions when developing Backstage plugins
---

## Troubleshooting & Common Issues

This guide helps you resolve common problems encountered when developing Backstage plugins.

### Plugin Creation Issues

#### Plugin not created after running `yarn new`

Make sure you've run `yarn install` from the project root before creating a new plugin:

```bash
yarn install
yarn new
```

#### Plugin doesn't appear in the local app

After creating a plugin, ensure it's properly imported and registered. For frontend plugins, check:

- The plugin is exported from its `src/plugin.ts` file
- The app is restarted after plugin creation
- Navigate to `http://localhost:3000/your-plugin-id` to verify

#### Type errors after creating a plugin

Run the TypeScript compiler to verify:

```bash
yarn tsc
```

If you see errors, ensure all dependencies are installed and the plugin structure matches the expected format.

### Build & Development Issues

#### Port already in use when running `yarn start`

The default ports are 3000 (frontend) and 7007 (backend). If these are in use:

```bash
# On macOS/Linux, find the process using the port
lsof -ti:3000
lsof -ti:7007

# Try graceful shutdown first (SIGTERM)
lsof -ti:3000 | xargs kill
lsof -ti:7007 | xargs kill

# If the process doesn't stop, force kill (SIGKILL)
lsof -ti:3000 | xargs kill -9
lsof -ti:7007 | xargs kill -9
```

Note: `lsof` is available on macOS and most Linux distributions. On Windows, use Task Manager or `netstat -ano | findstr :3000` to find the process ID.

Alternatively, specify different ports in your `app-config.yaml`.

#### Hot reload not working

If changes aren't reflected after saving:

1. Stop the dev server (Ctrl+C)
2. Clear any caches: `yarn clean`
3. Restart: `yarn start`

#### Build fails with memory errors

Increase Node.js memory limit:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
yarn start
```

### Backend Plugin Issues

#### Database connection errors

Ensure your database configuration in `app-config.yaml` is correct:

```yaml
backend:
  database:
    client: better-sqlite3
    connection: ':memory:'
```

For development, better-sqlite3 with in-memory storage is recommended.

#### API routes not responding

Check that:

- Your backend plugin is properly registered in `packages/backend/src/index.ts`
- The router is correctly configured with the proper path
- The backend server is running on port 7007

### Frontend Plugin Issues

#### Components not rendering

Common causes:

- Missing or incorrect imports
- Plugin not properly exported from `src/plugin.ts`
- Extension ID conflicts with existing plugins

#### Routing issues

If using the **new frontend system**, ensure your routes are defined correctly:

```typescript
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const myPluginRouteRef = createRouteRef();

export default createFrontendPlugin({
  id: 'my-plugin',
  routes: {
    root: myPluginRouteRef,
  },
  // ... extensions
});
```

For **legacy plugins** using `@backstage/core-plugin-api`, ensure routes are properly defined. See the [Structure of a Plugin](../../plugins/structure-of-a-plugin.md) documentation for details.

#### API calls to backend failing

Check:

- Backend is running on the expected port
- Proxy configuration in `app-config.yaml` if calling external APIs
- CORS settings if applicable
- API discovery is properly configured

### Testing Issues

#### Tests failing after creating a plugin

Run tests with:

```bash
CI=1 yarn test path/to/plugin
```

Common test issues:

- Mock data not properly configured
- API client mocks missing
- React Testing Library queries timing out - use `.findBy*` queries

#### API report errors

After making changes to public APIs, regenerate API reports:

```bash
yarn build:api-reports
```

This updates the `.api.md` files that document your plugin's public interface.

## Additional Resources

### Plugin Development Guides

For comprehensive guides on building plugins, refer to:

- [Plugin Development Guide](../../plugins/plugin-development.md) - Complete guide to building plugins
- [Backend Plugin Development](./backend/001-first-steps.md) - Backend-specific guide
- [Frontend Plugin Development](./frontend/001-first-steps.md) - Frontend-specific guide
- [Structure of a Plugin](../../plugins/structure-of-a-plugin.md) - Understanding plugin architecture
- [Testing Plugins](../../plugins/testing.md) - Testing strategies and best practices

### Getting Support

If you encounter issues not covered in this guide:

#### Backstage Community Discord

Join the [Backstage Community Discord](https://discord.gg/backstage-687207715902193673) for any questions.

#### GitHub Resources

- **[Discussions](https://github.com/backstage/backstage/discussions)** - Ask questions and share ideas
- **[Issues](https://github.com/backstage/backstage/issues)** - Report bugs or request features
- **[Documentation](https://backstage.io/docs)** - Browse the full documentation

## Contributing Back

If you've solved a problem that's not documented here, consider contributing:

1. Open a PR to add your solution to this guide
2. Share your experience in Discord to help others
3. Create a discussion post with detailed solutions for complex issues

Your contributions help make Backstage better for everyone!
