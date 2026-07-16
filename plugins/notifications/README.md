# notifications

Welcome to the notifications plugin!

## Getting started

To install, please refer the [Getting Started](https://backstage.io/docs/notifications) Backstage Notifications and Signals documentation section.

Please mind installing the `@backstage/plugin-notifications-backend` and `@backstage/plugin-notifications-node` packages before this frontend plugin.

## Homepage card

See [UnreadNotificationsCard documentation](./docs/UnreadNotificationsCard.md) for configuring the unread notifications card on the RHDH Homepage Dashboard.

For deep-link route parameter support, see [route parameter investigation](./docs/route-params-investigation.md).

## Real-time notifications

To be able to get real-time notifications to the UI without need for the user to refresh the page, you also need to
add `@backstage/plugin-signals` package to your installation.
