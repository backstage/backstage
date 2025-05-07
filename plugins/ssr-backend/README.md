# ssr

Example simple Server Side rendering backend plugin

Used as POC for enabling support for loading .tsx files within a backend environment, which can be useful for rendering
emails or content on the backend

## Installation

This plugin is installed via the `@backstage/plugin-ssr-backend` package. To install it to your backend package, run the
following command:

```bash
# From your root directory
yarn --cwd packages/backend add @backstage/plugin-ssr-backend
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-ssr-backend'));
```

## Development

This plugin backend can be started in a standalone mode from directly in this
package with `yarn start`. It is a limited setup that is most convenient when
developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn start` from the root directory.
