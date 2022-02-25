---
'@backstage/plugin-scaffolder': patch
---

Added some deprecations as follows:

- **DEPRECATED**: `TemplateCardComponent` and `TaskPageComponent` props have been deprecated, and moved to a `components` prop instead. You can pass them in through there instead.

Other notable changes:

- `scaffolderApi.scaffold()` `values` type has been narrowed from `Record<string, any>` to `Record<string, JsonValue>` instead.
