---
'@backstage/plugin-notifications': minor
---

Added an unread notifications home page card and NFS home widget.

- New `UnreadNotificationsCard` for legacy and dynamic home page integrations
- New NFS `notificationsHomeModule` / `home-page-widget:home/unread-notifications` expose for module federation
- Deep-link support from the card to `/notifications?id=<notificationId>`
- Signals-driven refresh with polling fallback when signals are unavailable
- Plain-text title/description rendering for notification summaries
