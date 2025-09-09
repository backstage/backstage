---
'@backstage/plugin-home': patch
---

Fixed race condition in CustomHomepageGrid by waiting for storage to load before rendering custom layout to prevent
rendering of the default content.
