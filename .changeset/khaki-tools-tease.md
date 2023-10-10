---
'@backstage/plugin-scaffolder-backend': minor
---

Updated `publish:gitlab` action properties to support additional Gitlab project settings:

- general project settings provided by gitlab project create API (new `settings` property)
- branch level settings to create additional branches and make them protected (new `branches` property)
- project level environment variables settings (new `projectVariables` property)

Marked existed properties `repoVisibility` and `topics` as deprecated, as they are covered by `settings` property.
