---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Moved several implementations of built-in APIs from being hardcoded in the app to instead be provided as API extensions. This moves all API-related inputs from the `app` extension to the respective API extensions. For example, extensions created with `ThemeBlueprint` are now attached to the `themes` input of `api:app-theme` rather than the `app` extension.
