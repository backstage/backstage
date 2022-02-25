---
'@backstage/plugin-scaffolder': patch
---

Added some deprecations as follows:

- **DEPRECATED**: `TemplateCardComponent` and `TaskPageComponent` props have been deprecated, and moved to a `components` prop instead. You can pass them in through there instead.
- **DEPRECATED**: `TemplateList` and `TemplateListProps` has been deprecated. Please use the `TemplateCard` to create your own list component instead.

Other notable changes:

- `scaffolderApi.scaffold()` `values` type has been narrowed from `Record<string, any>` to `Record<string, JsonValue>` instead.
- Moved all navigation internally over to using `routeRefs` and `subRouteRefs`
