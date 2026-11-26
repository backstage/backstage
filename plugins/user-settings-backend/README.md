# User settings backend

This backend allows to save user specific settings. All requests need to be
authorized, as the user identifier (`userEntityRef`) is resolved using the
authorization token.

## Installation

Install the backend plugin

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-user-settings-backend @backstage/plugin-signals-backend
```

Add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
backend.add(import('@backstage/plugin-user-settings-backend'));
// The signals backend is technically optional but enables real-time update of user
// settings across different sessions
backend.add(import('@backstage/plugin-signals-backend'));
```

## Documentation

See [User Settings Backend](https://backstage.io/docs/features/user-settings/backend)
for how to connect the frontend, the API reference, and local development.
