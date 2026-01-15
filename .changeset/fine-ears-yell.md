---
'@backstage/plugin-app-react': minor
---

Added `AppRootWrapperBlueprint` that replaces the blueprint with the same name that was deprecated in `@backstage/frontend-plugin-api`. These blueprints are not directly interchangeable the new one exported from this package can only be used in `app` plugin modules and is restricted from use in other plugins.
