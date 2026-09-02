---
'@backstage/plugin-notifications-backend': patch
---

Fixed config-level origin overrides being ignored when the channel is disabled. Previously, setting `enabled: false` on a channel would prevent origin-level `enabled: true` overrides from taking effect. Now, admins can disable a channel by default while still enabling specific origins.
