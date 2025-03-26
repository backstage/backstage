# @backstage/plugin-notifications-backend-module-slack

The Slack backend module for the notifications plugin.

## Getting Started

### Module Installation

Add the module to your backend:

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-notifications-backend-module-slack'));
```

### Slack Configuration

To use this you'll need to create a Slack App or use an existing one. It should have at least the following scopes:
`chat:write`, `users:read`, `im:write` (for direct message support).

Additionally you may include scopes `chat:write.public` in order to send messages to public channels your app is not
a member of.

These scopes are under OAuth & Permissions. You will also want to save the Bot User OAuth Token. This will be needed
in the following step to configure `app-config.yaml`.

### Configure Backstage

You'll now need to configure the Slack module in your `app-config.yaml`.

```yaml
notifications:
  processors:
    slack:
      - token: xoxb-XXXXXXXXX
```

Multiple instances can be added in the `slack` array, allowing you to have multiple configurations if you need to send
messages to more than one Slack workspace. Org-Wide App installation is not currently supported.

### Entity Requirements

Entities must be annotated with one of the following annotations:

- `slack.com/user-id` for direct messages
- `slack.com/channel-name` for public channel messages
- `slack.com/channel-id` for public or private channel messages

Slack prefers use of ID over name and `slack.com/channel-id` is the recommended annotation.

### Observability

The processor includes the following counter metrics if you are exporting metrics using OpenTelemetry:

- `notifications.processors.slack.sent.count` - The number of messages sent
- `notifications.processors.slack.error.count` - The number of messages that failed to send
