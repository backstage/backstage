---
'@backstage/plugin-catalog': patch
---

This is a quick fix (while #2791 is being implemented) to make it possible view non well known component types listed in the catalog index page. It buckets any component entities that are not a `service`, `library`, or `documentation` into the `Other` tab. It also displays a `Type` column when on Other tab.
