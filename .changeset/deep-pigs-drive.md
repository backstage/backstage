---
'@backstage/cli-common': patch
---

Added `openBrowser`, which opens a URL in the user's browser and reuses an existing Chromium tab on macOS where possible. Install the optional `open` peer dependency to use it; without it `openBrowser` returns `false`.
