---
'@backstage/plugin-scaffolder-backend': minor
---

Allow using `globby`'s negative matching with `copyWithoutTemplating`/`copyWithoutRender`. This allows including an entire subdirectory while excluding a single file so that it will still be templated instead of needing to list every other file and ensure the list is updated when new files are added.
