---
'@backstage/core-components': patch
---

Deprecated legacy page shells (`Page`, `PageWithHeader`, `Header`), routed tabs (`TabbedLayout`, `TabbedLayout.Route`, `RoutedTabs`), `AlertDisplay`, `AppIcon`, the named icon wrappers, and their associated public types for new frontend development. Existing exports and behavior remain available, including in migrated plugins.

Use page and sub-page extensions and `PageLayout` from `@backstage/frontend-plugin-api` for framework-managed pages, or compose `@backstage/ui` headers and tabs with explicit routing for standalone layouts. Legacy themes, arbitrary header content, document titles, and focus behavior need deliberate migration. Rely on the new frontend app's existing alert/toast display. For app-customizable icons, use `useApi(coreApis.icons).icon(key)` from `@backstage/frontend-plugin-api` and render the returned element, handling missing icons as needed.
