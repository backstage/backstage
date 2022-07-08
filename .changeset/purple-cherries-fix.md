---
'@backstage/plugin-sentry': minor
---

Added the possibility to specify organization per component, now the annotation `sentry.io/project-slug` can have the format of `[organization]/[project-slug]` or just `[project-slug]`.

**BREAKING**: The method `fetchIssue` changed the signature:

```diff
export interface SentryApi {
  fetchIssues(
-     project: string,
-     statsFor: string,
-     query?: string,
+     entity: Entity,
+     options: {
+       statsFor: string;
+       query?: string;
+     },
  ): Promise<SentryIssue[]>;
}
```
