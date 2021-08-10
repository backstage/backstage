---
'@backstage/techdocs-common': minor
---

Set the correct `edit_uri` or `repo_url` for documentation pages that are hosted on GitHub and GitLab.

The constructor of the `TechDocsGenerator` changed.
Prefer the use of `TechdocsGenerator.fromConfig(…)` instead:

```diff
- const techdocsGenerator = new TechdocsGenerator({
+ const techdocsGenerator = TechdocsGenerator.fromConfig(config, {
    logger,
    containerRunner,
-   config,
  });
```
