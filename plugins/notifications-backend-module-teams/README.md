# @backstage/plugin-notifications-backend-module-teams

The teams backend module for the notifications plugin.

The module adds a notification processor that can be used to send notifications to Microsoft Teams
channels using webhooks.

To use this, you have to create a webhook to the channel you want to send notifications to.
For entities you must add the annotation as follows:

```yaml
metadata:
  annotations:
    teams.microsoft.com/webhook: https://teaams.microsoft.com/webhook/...
```

When a notification is sent to this entity, the processor will send it to the teams channel.

For broadcast notifications, you can configure the webhook in the `app-config.yaml` file:

```yaml
notifications:
  teams:
    broadcastConfig:
      webhooks:
        - https://teaams.microsoft.com/webhook/...
```

This will send all `broadcast` notifications to the configured webhooks.

## Why not direct messages to users?

This is a restriction in the Microsoft Teams API. It is not possible to send direct messages to users
if you don't have a specific bot for that. Support for this may be added in the future.
