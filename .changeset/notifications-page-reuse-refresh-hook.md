---
'@backstage/plugin-notifications': patch
---

The notifications page now reuses the shared refresh helper used by the unread notifications home card, so it refreshes from signals when available and falls back to polling when signals are unavailable.

The unread notifications home card now supports sorting by newest or oldest, centers its empty state, uses a clearer header style without the title divider, and ships with a slightly shorter default height. Deep-linked notifications on the notifications page are highlighted with a clearer info background.
