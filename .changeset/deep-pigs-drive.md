---
'@backstage/cli-common': patch
---

Added `openBrowser`, which opens a URL in the user's browser and reuses an existing Chromium tab on macOS where possible. Only the default-browser fallback requires the optional `open` peer dependency; `openBrowser` warns and returns `false` when that path is reached without it.
