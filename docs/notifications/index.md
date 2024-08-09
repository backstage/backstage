---
id: index
title: Getting Started
description: How to get started with the notifications and signals
---

The Backstage Notifications System provides a way for plugins and external services to send notifications to Backstage users.
These notifications are displayed in the dedicated page of the Backstage frontend UI or by frontend plugins per specific scenarios.
Additionally, notifications can be sent to external channels (like email) via "processors" implemented within plugins.

Notifications can be optionally integrated with the signals (a push mechanism) to ensure users receive them immediately.

### Upgrade to the latest version of Backstage

To ensure your version of Backstage has all the latest notifications and signals related functionality, it’s important to upgrade to the latest version. The [Backstage upgrade helper](https://backstage.github.io/upgrade-helper/) is a great tool to help ensure that you’ve made all the necessary changes during the upgrade!

## About notifications

Notifications are messages sent to either individual users or groups.
They are not intended for inter-process communication of any kind.

There are two basic types of notifications:

- **Broadcast**: Messages sent to all users of Backstage.
- **Entity**: Messages delivered to specific listed entities, such as Users or Groups.

Example of use-cases:

- System-wide announcements or alerts
- Notifications for component owners: e.g., build failures, successful deployments, new vulnerabilities
- Notifications for individuals: e.g., updates you have subscribed to, new required training courses
- Notifications pertaining to a particular entity in the catalog: A notification might apply to an entity and the owning team.

## Installation in Older Environments

Newer versions of instances created by the create-app have both the notifications and signals plugins included by default, this section can be skipped right to the Configuration.

Following installation instructions are valid for enabling the plugins in older environments.

### Add Notifications Backend

```bash
yarn workspace backend add @backstage/plugin-notifications-backend
```

Add the notifications to your `backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-notifications-backend'));
```

### Add Notifications Frontend

```bash
yarn workspace app add @backstage/notifications
```

To add the notifications main menu, add following to your `packages/app/src/components/Root/Root.tsx`:

```tsx
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';

<SidebarPage>
  <Sidebar>
    <SidebarGroup>
      // ...
      <NotificationsSidebarItem />
    </SidebarGroup>
  </Sidebar>
</SidebarPage>;
```

Also add the route to notifications to `packages/app/src/App.tsx`:

```tsx
import { NotificationsPage } from '@backstage/plugin-notifications';

<FlatRoutes>
  // ...
  <Route path="/notifications" element={<NotificationsPage />} />
</FlatRoutes>;
```

### Optional: Add Signals Backend

Optionally add Signals to your backend by

```bash
yarn workspace backend add @backstage/plugin-signals-backend
```

Add the signals to your `backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-signals-backend'));
```

### Optional: Signals Frontend

The use of signals is optional but improves user experience.

Start with:

```bash
yarn workspace app add @backstage/plugin-signals
```

To install the plugin, you have to add the following to your `packages/app/src/plugins.ts`:

```ts
export { signalsPlugin } from '@backstage/plugin-signals';
```

And make sure that your `packages/app/src/App.tsx` contains:

```ts
import * as plugins from './plugins';

const app = createApp({
  // ...
  plugins: Object.values(plugins),
  // ...
});
```

If the signals plugin is properly configured, it will be automatically discovered by the notifications plugin and used.

## Configuration

### Notifications Backend

The Notifications backend plugin provides an API to create notifications, list notifications per logged-in user, and search based on parameters.

The plugin uses a relational [database](https://backstage.io/docs/getting-started/config/database) for persistence, no specifics are introduced in this context.

No additional configuration in the app-config is needed, except for optional additional modules for `processors`.

### Notifications Frontend

The recipients of notifications have to be entities in the catalog, e.g. of the User or Group kind.

Otherwise no specific configuration is needed for the front-end notifications plugin.

All parametrization is done through component properties, such as the `NotificationsSidebarItem`, which can be used as an active left-side menu item in the front-end.

![Notifications Page](notificationsPage.png)

In the `packages/app/src/components/Root/Root.tsx`, tweak the [properties](https://backstage.io/docs/reference/plugin-notifications.notificationssidebaritem) of the `<NotificationsSidebarItem />` per specific needs.

## Use

New notifications can be sent either by a backend plugin or an external service through the REST API.

### Backend

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
      async init({ config, logger, httpRouter, notificationService }) {
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
notificationService.send({
  recipients /* of the broadcast or entity type */,
  payload /* actual message */,
});
```

Refer the [API documentation](https://github.com/backstage/backstage/blob/master/plugins/notifications-node/api-report.md) for further details.

### Signals

The use of signals with notifications is optional but generally enhances user experience and performance.

When a notification is created, a new signal is emitted to a general-purpose message bus to announce it to subscribed listeners.

The frontend maintains a persistent connection (WebSocket) to receive these announcements from the notifications channel.
The specific details of the updated or created notification should be retrieved via a request to the notifications API, except for new notifications, where the payload is included in the signal for performance reasons.

In a frontend plugin, to subscribe for notifications' signals:

```ts
import { useSignal } from '@backstage/plugin-signals-react';

const { lastSignal } = useSignal<NotificationSignal>('notifications');

React.useEffect(() => {
  /* ... */
}, [lastSignal, notificationsApi]);
```

### Consuming Notifications

In a front-end plugin, the simplest way to query a notification is by its ID:

```ts
import { useApi } from '@backstage/core-plugin-api';
import { notificationsApiRef } from '@backstage/plugin-notifications';

const notificationsApi = useApi(notificationsApiRef);

notificationsApi.getNotification(yourId);

// or with connection to signals:
notificationsApi.getNotification(lastSignal.notification_id);
```

### Extending Notifications via Processors

The notifications can be extended with `NotificationProcessor`. These processors allow to decorate notifications before they are sent or/and send the notifications to external services.

Depending on the needs, a processor can modify the content of a notification or route it to different systems like email, Slack, or other services.

A good example of how to write a processor is the [Email Processor](https://github.com/backstage/backstage/tree/master/plugins/notifications-backend-module-email).

Start off by creating a notification processor:

```ts
import { Notification } from '@backstage/plugin-notifications-common';
import { NotificationProcessor } from '@backstage/plugin-notifications-node';

class MyNotificationProcessor implements NotificationProcessor {
  async decorate(notification: Notification): Promise<Notification> {
    if (notification.origin === 'plugin-my-plugin') {
      notification.payload.icon = 'my-icon';
    }
    return notification;
  }

  async send(notification: Notification): Promise<void> {
    nodemailer.sendEmail({
      from: 'backstage',
      to: 'user',
      subject: notification.payload.title,
      text: notification.payload.description,
    });
  }
}
```

Both of the processing functions are optional, and you can implement only one of them.

Add the notification processor to the notification system by:

```ts
import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';
import { Notification } from '@backstage/plugin-notifications-common';

export const myPlugin = createBackendPlugin({
  pluginId: 'myPlugin',
  register(env) {
    env.registerInit({
      deps: {
        notifications: notificationsProcessingExtensionPoint,
        // ...
      },
      async init({ notifications }) {
        // ...
        notifications.addProcessor(new MyNotificationProcessor());
      },
    });
  },
});
```

### External Services

When the emitter of a notification is a Backstage backend plugin, it is mandatory to use the integration via `@backstage/plugin-notifications-node` as described above.

If the emitter is a service external to Backstage, an HTTP POST request can be issued directly to the API, assuming that authentication is properly configured.
Refer to the [service-to-service auth documentation](https://backstage.io/docs/auth/service-to-service-auth) for more details, focusing on the Static Tokens section for the simplest setup option.

An example request for creating a broadcast notification might look like:

```bash
curl -X POST https://[BACKSTAGE_BACKEND]/api/notifications -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_BASE64_SHARED_KEY_TOKEN" -d '{"recipients":{"type":"broadcast"},"payload": {"title": "Title of broadcast message","link": "http://foo.com/bar","severity": "high","topic": "The topic"}}'
```

## Additional info

An example of a backend plugin sending notifications can be found in https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-notifications.

Sources of the notifications and signal plugins:

- https://github.com/backstage/backstage/blob/master/plugins/notifications

- https://github.com/backstage/backstage/blob/master/plugins/notifications-backend

- https://github.com/backstage/backstage/blob/master/plugins/notifications-node

- https://github.com/backstage/backstage/blob/master/plugins/signals-react
