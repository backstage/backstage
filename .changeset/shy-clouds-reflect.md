---
'@backstage/config-loader': patch
---

The `FileConfigSource` will now retry file reading after a short delay if it reads an empty file. This is to avoid flakiness during watch mode where change events can trigger before the file content has been written.
