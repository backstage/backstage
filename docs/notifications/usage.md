---
id: usage
title: Usage
description: How to use the notifications and signals
---

## Notifications Backend

The Notifications backend plugin provides an API to create notifications, list notifications per logged-in user, and search based on parameters.

The plugin uses a relational [database](https://backstage.io/docs/getting-started/config/database) for persistence; no specifics are introduced in this context.

No additional configuration in the app-config is needed, except for optional additional modules for `processors`.

## Notifications Frontend

The recipients of notifications have to be entities in the catalog, e.g., of the User or Group kind.

Otherwise, no specific configuration is needed for the front-end notifications plugin.

All parametrization is done through component properties, such as the `NotificationsSidebarItem`, which can be used as an active left-side menu item in the front-end.

![Notifications Page](notificationsPage.png)

In the `packages/app/src/components/Root/Root.tsx`, tweak the [properties](https://backstage.io/docs/reference/plugin-notifications.notificationssidebaritem) of the `<NotificationsSidebarItem />` per specific needs.

## Usage

New notifications can be sent either by a backend plugin or an external service through the REST API.

## Backend

Regardless of technical feasibility, a backend plugin should avoid directly accessing the notifications REST API.
Instead, it should integrate with the `@backstage/plugin-notifications-node` to `send` (create) a new notification.

The reasons for this approach include the propagation of authorization in the API request and improved maintenance and backward compatibility in the future.

```ts
import { notificationService } from '@backstage/plugin-notifications-node';

export const myPlugin = createBackendPlugin({
  pluginId: 'myPlugin',
  register(env) {
    env.registerInit({
      deps: {
        // ...
        notificationService: notificationService,
      },
      async init({
        // ...
        notificationService,
      }) {
        httpRouter.use(
          await createRouter({
            // ...
            notificationService,
          }),
        );
      },
    });
  },
});
```

To emit a new notification:

```ts
await notificationService.send({
  recipients /* of the broadcast or entity type */,
  payload /* actual message */,
});
```

Refer the [API documentation](https://github.com/backstage/backstage/blob/master/plugins/notifications-node/report.api.md) for further details.

### External Services

When the emitter of a notification is a Backstage backend plugin, it is mandatory to use the integration via `@backstage/plugin-notifications-node` as described above.

If the emitter is a service external to Backstage, an HTTP POST request can be issued directly to the API, assuming that authentication is properly configured.
Refer to the [service-to-service auth documentation](https://backstage.io/docs/auth/service-to-service-auth) for more details, focusing on the Static Tokens section for the simplest setup option.

An example request for creating a broadcast notification might look like:

```bash
curl -X POST https://[BACKSTAGE_BACKEND]/api/notifications -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_BASE64_SHARED_KEY_TOKEN" -d '{"recipients":{"type":"broadcast"},"payload": {"title": "Title of broadcast message","link": "http://foo.com/bar","severity": "high","topic": "The topic"}}'
```

### Scaffolder Templates

You can use the `@backstage/plugin-scaffolder-backend-module-notifications` to send notifications when scaffolder templates are run. To install the module, add it to your backend plugin:

```bash
yarn workspace backend add @backstage/plugin-scaffolder-backend-module-notifications
```

Then, add the module to your backend:

```ts
const backend = createBackend();
// ...
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);
```

In your template you can now use `notification:send` action as part of the steps:

```yaml
steps:
  - id: notify
    name: Notify
    action: notification:send
    input:
      recipients: entity
      entityRefs:
        - component:default/backstage
      title: 'Template executed'
      info: 'Your template has been executed'
      severity: 'info'
      link: https://backstage.io
```

## Signals

The use of signals with notifications is optional but generally enhances user experience and performance.

When a notification is created, a new signal is emitted to a general-purpose message bus to announce it to subscribed listeners.

The frontend maintains a persistent connection (WebSocket) to receive these announcements from the notifications channel.
The specific details of the updated or created notification should be retrieved via a request to the notifications API, except for new notifications, where the payload is included in the signal for performance reasons.

In a frontend plugin, to subscribe to notifications' signals:

```ts
import { useSignal } from '@backstage/plugin-signals-react';

const { lastSignal } = useSignal<NotificationSignal>('notifications');

React.useEffect(() => {
  /* ... */
}, [lastSignal, notificationsApi]);
```

#### Using signals in your own plugin

It's possible to use signals in your own plugin to deliver data from the backend to the frontend in near real-time.

To use signals in your own frontend plugin, you need to add the `useSignal` hook from `@backstage/plugin-signals-react` from `@backstage/plugin-notifications-common` with optional generic type of the signal.

```ts
// To use the same type of signal in the backend, this should be placed in a shared common package
export type MySignalType = {
  user: string;
  data: string;
  // ....
};

const { lastSignal } = useSignal<MySignalType>('my-plugin');

useEffect(() => {
  if (lastSignal) {
    // Do something with the signal
  }
}, [lastSignal]);
```

To send signals from the backend plugin, you must add the `signalsServiceRef` to your plugin or module as a dependency.

```ts
import { signalsServiceRef } from '@backstage/plugin-signals-node';
export const myPlugin = createBackendPlugin({
  pluginId: 'my',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        signals: signalsServiceRef,
      },
      async init({ httpRouter, signals }) {
        httpRouter.use(
          await createRouter({
            signals,
          }),
        );
      },
    });
  },
});
```

To send the signal using the service, you can use the `publish` method.

```ts
signals.publish<MySignalType>({ user: 'user', data: 'test' });
```

## Consuming Notifications

In a front-end plugin, the simplest way to query a notification is by its ID:

```ts
import { useApi } from '@backstage/core-plugin-api';
import { notificationsApiRef } from '@backstage/plugin-notifications';

const notificationsApi = useApi(notificationsApiRef);

notificationsApi.getNotification(yourId);

// or with connection to signals:
notificationsApi.getNotification(lastSignal.notification_id);
```
