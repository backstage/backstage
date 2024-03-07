# notifications-external

Welcome to the notifications-external backend plugin!

This plugin exposes REST API used by external services to create notifications in the Backstage.

The API internally calls the NotificationsService (by the `@backstage/plugin-notifications-backend`).

## Getting started

As a minimum, have the `@backstage/plugin-notifications-backend` plugin installed and configured.

Then, add this plugin to your backend:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-notifications-external-backend'));
```

## Usage

Once the plugin is running and the backend NotificationsService properly configured, a new message can be created by a simple POST request to the exposed API:

```sh
  curl -X POST http://localhost:7007/api/notifications-external \
    -H "Content-Type: application/json" \
    -H "notifications-secret: mysecret" \
    -d '{"recipients":{"type":"entity", "entityRef": "user:development/guest"}, "payload":{"title": "External user notification"}}'
```

Or a broadcasted message:

```sh
  curl -X POST http://localhost:7007/api/notifications-external \
    -H "Content-Type: application/json" \
    -H "notifications-secret: mysecret" \
    -d '{"recipients":{"type":"broadcast"}, "payload":{"title": "External broadcasted notification"}}'
```
