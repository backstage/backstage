---
'@backstage/plugin-notifications': patch
---

The notifications page now reuses the shared refresh helper used by the unread notifications home card, so it refreshes from signals when available and falls back to polling when signals are unavailable.
