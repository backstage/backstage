---
'@backstage/plugin-scaffolder-backend': minor
---

Updated publish:gitlab action properties to support project and branches level configuration.
Project level configuration is based on the Gitlab Project Create API available options. Is is available via `settings` property.
Branch level configuration allow to create additional branches and make them protected. It is available via `branches` property.

Marked existed properties `repoVisibility` and `topics` as deprecated, as they are covered by `settings` property.
