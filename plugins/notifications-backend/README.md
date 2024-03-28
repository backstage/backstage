# notifications

Welcome to the notifications backend plugin!

## Getting started

Add the notifications to your backend:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-notifications-backend'));
```

For users to be able to see notifications in real-time, you have to install also
the signals plugin (`@backstage/plugin-signals-node`, `@backstage/plugin-signals-backend`, and
`@backstage/plugin-signals`).

## Extending Notifications

The notifications can be extended with `NotificationProcessor`. These processors allow to decorate notifications
before they are sent or/and send the notifications to external services.

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

## Sending notifications

To be able to send notifications to users, you have to integrate the `@backstage/plugin-notifications-node`
to your application and plugins.
