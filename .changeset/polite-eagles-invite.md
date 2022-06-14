---
'@backstage/plugin-scaffolder': minor
---

A new template editor has been added which is accessible via the context menu on the top right hand corner of the Create page. It allows you to load a template from a local directory, edit it with a preview, execute it in dry-run mode, and view the results. Note that the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) must be supported by your browser for this to be available.

To support the new template editor the `ScaffolderApi` now has an optional `dryRun` method, which is implemented by the default `ScaffolderClient`.
