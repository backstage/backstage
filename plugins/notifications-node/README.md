# @backstage/plugin-notifications-node

Welcome to the Node.js library package for the notifications plugin!

## Getting Started

To be able to send notifications from other backend plugins, the `NotificationService` must be initialized for the
environment. Add notification service to your `plugin.ts` as a dependency for init

```ts
import { notificationService } from '@backstage/plugin-notifications-node';

export const myPlugin = createBackendPlugin({
  pluginId: 'myPlugin',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        notificationService: notificationService,
      },
      async init({ config, logger, httpRouter, notificationService }) {
        httpRouter.use(
          await createRouter({
            config,
            logger,
            permissions,
            notificationService,
          }),
        );
      },
    });
  },
});
```

You also need to set up the `@backstage/plugin-notifications-backend` and `@backstage/plugin-notifications`
to be able to show notifications in the UI.

## Sending notifications

To send notifications from backend plugin, use the `NotificationService::send` functionality. This function will
save the notification and optionally signal the frontend to show the latest status for users.

When sending notifications, you can specify the entity reference of the notification. If the entity reference is
a user, the notification will be sent to only that user. If it's a group, the notification will be sent to all
members of the group. If it's some other entity, the notification will be sent to the owner of that entity.

If the notification has `scope` set and user already has notification with that scope, the existing notification
will be updated with the new notification values and moved to inbox as unread.
