---
'@backstage/frontend-plugin-api': minor
---

Removed the deprecated `AnalyticsImplementationBlueprint`, `AnalyticsImplementationFactory`, and `ExtensionFactoryMiddleware` exports. Import `AnalyticsImplementationBlueprint` and `AnalyticsImplementationFactory` from `@backstage/plugin-app-react`, and `ExtensionFactoryMiddleware` from `@backstage/frontend-app-api` instead. No changes to their usage are needed beyond updating the imports.
