---
'yarn-plugin-backstage': patch
---

Add both `npm:` and `backstage:` ranges to the lockfile to ensure compatibility with tools that parse the lockfile and ensure dependencies stay locked when building dist workspaces.
