---
'@backstage/cli-module-build': patch
---

Added support for a `public-sources` folder in app packages. Each TypeScript or JavaScript file directly in the folder is built into a standalone script, which the `public/index.html` template refers to as `<%= sources.<name> %>`, where `<name>` is the file name without its extension. In production builds the scripts get a content hash in their name and are written to `dist/static/`, so they can be cached for a long time.
