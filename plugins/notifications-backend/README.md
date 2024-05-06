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

## Sending Notifications By Backend Plugins

To be able to send notifications to users by other plugins, you have to integrate the `@backstage/plugin-notifications-node`
to your application and plugins. For the API, please refer documentation there.

## Sending Notifications By External Services

External services can create new messages by sending POST request to the REST API.

To be able to do so, `external access` needs to be enabled as described in the [documentation](https://backstage.io/docs/auth/service-to-service-auth), e.g. via the `static tokens`.

Once the API can be accessed, the request can look like:

```
curl -X POST [YOUR_SERVER_URL]/api/notifications -H "Content-Type: application/json" -H "Authorization: Bearer [BASE64_ENCODED_ACCESS_TOKEN]" -d '{"recipients":{"type":"entity","entityRef":"user:development/guest"},"payload": {"title": "Title of user-targeted external message","description": "The description","link": "http://foo.com/bar","severity": "high","topic": "The topic"}}'
```
