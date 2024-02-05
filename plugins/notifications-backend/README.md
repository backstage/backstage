# notifications

Welcome to the notifications backend plugin!

## Getting started

First you have to install `@backstage/plugin-notifications-node` and `@backstage/plugin-signals-node`
packages.

Add the notifications to your backend:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-notifications-backend'));
```

## Extending Notifications

The notifications can be extended with `NotificationProcessor`. These processors allow to decorate notifications
before they are sent or/and send the notifications to external services.
