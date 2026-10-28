---
'@backstage/plugin-app': minor
---

Provides the revised dialog and icons APIs under versioned IDs, while retaining compatibility implementations under `core.dialog` and `core.icons`. Older consumers can continue using `DialogApi.show`, `DialogApi.showModal`, and `IconsApi.getIcon`. These compatibility APIs delegate to the current implementations, including custom overrides.

New dialog callers should use `DialogApi.open`, providing their own dialog surface, backdrop, and dismissal behavior. New icon callers should use `IconsApi.icon` to obtain an icon element.
