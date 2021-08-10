---
'@backstage/techdocs-common': patch
---

Only write the updated `mkdocs.yml` file if the content was updated.

This keeps local files unchanged if the `dir` annotation is used in combination with the `file` location.
