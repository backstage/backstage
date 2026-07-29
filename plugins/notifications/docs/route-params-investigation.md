# Notifications route parameter investigation

## Question

Does `@backstage/plugin-notifications` support deep-linking to a specific notification via a route/query parameter (e.g. `/notifications?id=<notificationId>`)?

## Findings

### Upstream baseline

The upstream Notifications plugin originally exposed only a paginated `NotificationsPage` at `/notifications`. It did **not** read query parameters to focus a specific notification.

### Implementation added in this change

Deep-linking is now supported using the `id` query parameter:

| Layer                        | Behavior                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `UnreadNotificationsCard`    | Notification title links to `/notifications?id=<notificationId>`                                                         |
| `getNotificationsPageLink()` | Utility that builds `/notifications` or `/notifications?id=...`                                                          |
| `NotificationsPage`          | Reads `id` from `useSearchParams()`, fetches the notification, resets to page 0, and ensures it appears in the table     |
| `NotificationsTable`         | Highlights the matching row, scrolls it into view, moves keyboard focus to it, and shows the full description (expanded) |

### Example

```
/notifications?id=notification-1
```

### Requirements for RHDH

1. Install `@backstage/plugin-notifications` and `@backstage/plugin-notifications-backend`
2. Register the `/notifications` route with `NotificationsPage`
3. Rebuild and re-export the dynamic plugin after source changes (`yarn build` before `export-dynamic-plugin`)

### Limitations

- Focus/highlight is implemented in the notifications table UI; there is no separate detail drawer or accordion component.
- If the target notification is on a later page, the page resets to 0 and the notification is prepended when needed so it remains visible.
