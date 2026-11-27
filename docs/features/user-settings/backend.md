---
id: backend
title: User Settings Backend
sidebar_label: Backend
description: Storing user specific settings in the backend with the User Settings backend plugin
---

The User Settings backend plugin, `@backstage/plugin-user-settings-backend`, stores settings for each signed-in user in the Backstage database. It lets settings such as the selected theme or starred entities follow users across browsers and devices, instead of being kept in the local storage of a single browser.

All requests to the plugin must be authenticated as a user. The user identifier, `userEntityRef`, is resolved from the authorization token of the request, so users can only read and write their own settings. Requests from other principals, such as service tokens, are rejected.

## Installation

### Backend

Install the backend plugin, and optionally the signals backend plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-user-settings-backend @backstage/plugin-signals-backend
```

Add the plugins to your backend in `packages/backend/src/index.ts`:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-user-settings-backend'));
// The signals backend is optional, but enables real-time updates of user
// settings across the different sessions of a user
backend.add(import('@backstage/plugin-signals-backend'));
```

### Frontend

To make use of the backend, replace the default `WebStorage` implementation with `UserSettingsStorage` from `@backstage/plugin-user-settings` by providing it as the `storageApiRef` API. For example, in an app that uses the legacy frontend system:

```ts title="packages/app/src/apis.ts"
import {
  AnyApiFactory,
  createApiFactory,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { UserSettingsStorage } from '@backstage/plugin-user-settings';
import { signalApiRef } from '@backstage/plugin-signals-react';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: storageApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      errorApi: errorApiRef,
      fetchApi: fetchApiRef,
      identityApi: identityApiRef,
      signalApi: signalApiRef, // Optional
    },
    factory: deps => UserSettingsStorage.create(deps),
  }),
];
```

The `signalApi` dependency is only needed if you installed the signals backend plugin.

## API

The plugin is mounted under `/api/user-settings`. Settings are grouped in buckets, and each value is stored under a key within a bucket.

| Method   | Path                         | Description                                                                          |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| `POST`   | `/multiget`                  | Reads several values at once. The body is `{ "items": [{ "bucket", "key" }, ...] }`. |
| `GET`    | `/buckets/:bucket/keys/:key` | Reads a single value.                                                                |
| `PUT`    | `/buckets/:bucket/keys/:key` | Writes a single value. The body is `{ "value": ... }`, and `value` is required.      |
| `DELETE` | `/buckets/:bucket/keys/:key` | Deletes a single value and responds with `204`.                                      |

When the signals backend plugin is installed, writes and deletes publish a message on the `user-settings` channel to the user. Other open sessions of the same user use this to refresh their settings.

## Development

Use `yarn start` in the plugin directory to start the local development environment. To simplify access to the API, the token is automatically set to `user:default/john_doe`.

You can change the user by setting a custom `Authorization` header. The raw `Bearer` value is used directly as the user:

```bash
curl --request GET 'http://localhost:7007/api/user-settings/buckets/my-bucket/keys/my-key' --header 'Authorization: Bearer user:default/custom-user'
```
