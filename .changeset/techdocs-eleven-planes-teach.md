---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs-backend': patch
---

Applies only if you use TechDocs local builder instead of building on CI/CD i.e. if `techdocs.builder` in your `app-config.yaml` is set to `'local'`

Improvements

1. Do not check for updates in the repository if a check has been made in the last 60 seconds. This is to prevent the annoying check for update on every page switch or load.
2. No need to maintain an in-memory etag storage, and use the one stored in `techdocs_metadata.json` file alongside generated docs.

New feature

1. You can now use a mix of basic and recommended setup i.e. techdocs.builder is `'local'` but using an external cloud storage instead of local storage. Previously, in this setup, the docs would never get updated.
