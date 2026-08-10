---
'@backstage/ui': patch
---

Tab navigation in the header now replaces the current browser history entry instead of pushing a new one. This prevents the back button from cycling through previously selected tabs, so it returns to the actual previous page instead.
