# notifications

Welcome to the notifications plugin!

## Getting started

To install, please refer the [Getting Started](https://backstage.io/docs/notifications) Backstage Notifications and Signals documentation section.

Please mind installing the `@backstage/plugin-notifications-backend` and `@backstage/plugin-notifications-node` packages before this frontend plugin.

## User-specific notification settings

When the User Settings plugin is installed, a **Notifications** tab is available on the User Settings page without additional configuration. For more details, see [user-specific notification settings](https://backstage.io/docs/notifications/#user-specific-notification-settings).

To disable the tab, add the following to your `app-config.yaml`:

```yaml
app:
  extensions:
    - sub-page:notifications/settings: false
```

## Real-time notifications

To be able to get real-time notifications to the UI without need for the user to refresh the page, you also need to
add `@backstage/plugin-signals` package to your installation.
