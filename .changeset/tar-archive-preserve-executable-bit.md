---
'@backstage/backend-defaults': patch
---

Fixed `TarArchiveResponse` to preserve the executable bit when extracting tar archives. Previously, `tar.extract()` was called without `chmod: true`, causing the OS umask to silently strip the execute permission from files that should be executable (e.g. shell scripts with mode `0755`). This was particularly noticeable when using `fetch:template` with templates hosted on GitHub, whose tarballs correctly include mode bits. The fix adds `chmod: true` and `processUmask: 0o22` to the `tar.extract()` call, ensuring extracted files always have the exact permissions recorded in the archive.
