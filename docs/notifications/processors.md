---
id: processors
title: Processors
description: How to setup notification processors
---

Notifications can be extended with `NotificationProcessor`. These processors allow you to decorate notifications before they are sent and/or send the notifications to external services.

Depending on your needs, a processor can modify the content of a notification or route it to different systems like email, Slack, or other services.

A good example of how to write a processor is the [Email Processor](https://github.com/backstage/backstage/tree/master/plugins/notifications-backend-module-email).

Start off by creating a notification processor:

```ts
import { Notification } from '@backstage/plugin-notifications-common';
import { NotificationProcessor } from '@backstage/plugin-notifications-node';

class MyNotificationProcessor implements NotificationProcessor {
  // preProcess is called before the notification is saved to database.
  // This is a good place to modify the notification before it is saved and sent to the user.
  async preProcess(notification: Notification): Promise<Notification> {
    if (notification.origin === 'plugin-my-plugin') {
      notification.payload.icon = 'my-icon';
    }
    return notification;
  }

  // postProcess is called after the notification is saved to database and the signal is emitted.
  // This is a good place to send the notification to external services.
  async postProcess(notification: Notification): Promise<void> {
    nodemailer.sendEmail({
      from: 'backstage',
      to: 'user',
      subject: notification.payload.title,
      text: notification.payload.description,
    });
  }
}
```

Both of the processing functions are optional, and you can just implement one of them.

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

## Built-in Processors

Backstage comes with some processors that can be used immediately.

### Email Processor

Email processor is used to send notifications to users using email. To install the email processor, add the `@backstage/plugin-notifications-backend-module-email` package to your backend.

```bash
yarn workspace backend add @backstage/plugin-notifications-backend-module-email
```

Add the email processor to your backend:

```ts
import { createBackend } from '@backstage/plugin-notifications-backend';
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-notifications-backend-module-email'));
```

To configure the email processor, you need to add the following configuration to your `app-config.yaml`:

```yaml
notifications:
  email:
    smtp:
      host: smtp.example.com
      port: 587
      secure: false
      username: ${SMTP_USERNAME}
      password: ${SMTP_PASSWORD}
```

Apart from STMP, the email processor also supports the following transmissions:

- SES
- sendmail
- stream (only for debugging purposes)

See more information at <https://github.com/backstage/backstage/blob/master/plugins/notifications-backend-module-email/README.md>

### Slack Processor

Slack processor is used to send notifications to users and channels in Slack.

### Slack Configuration

To use this you'll need to create a Slack App or use an existing one. It should have at least the following scopes:
`chat:write`, `users:read`, `im:write` (for direct message support).

Additionally you may include scopes `chat:write.public` in order to send messages to public channels your app is not
a member of.

These scopes are under OAuth & Permissions. You will also want to save the Bot User OAuth Token. This will be needed
in the following step to configure `app-config.yaml`.

### Configure Backstage

To install the Slack processor, add the `@backstage/plugin-notifications-backend-module-slack` package to your backend.

```bash
yarn workspace backend add @backstage/plugin-notifications-backend-module-slack
```

Add the Slack processor to your backend:

```ts
// packages/backend/src/index.ts
import { createBackend } from '@backstage/plugin-notifications-backend';
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-notifications-backend-module-slack'));
```

Using the token you obtained from your Slack App, configure the Slack module in your `app-config.yaml`.

```yaml
notifications:
  processors:
    slack:
      - token: xoxb-XXXXXXXXX
        broadcastChannels: # Optional, if you wish to support broadcast notifications.
          - C12345678
```

Multiple instances can be added in the `slack` array, allowing you to have multiple configurations if you need to send
messages to more than one Slack workspace. Org-Wide App installation is not currently supported.

### Entity Requirements

Entities must be annotated with the following annotation:

- `slack.com/bot-notify`

The value may be any Slack ID supported by [chat.postMessage](https://api.slack.com/methods/chat.postMessage), for example a user (U12345678), channel (C12345678), group, or direct message chat.

It's also possible to use a user's email address or channel name, however IDs are recommended by Slack.
Private channels/chats must use an ID.

### Observability

The processor includes the following counter metrics if you are exporting metrics using OpenTelemetry:

- `notifications.processors.slack.sent.count` - The number of messages sent
- `notifications.processors.slack.error.count` - The number of messages that failed to send
