---
'@backstage/plugin-scaffolder-backend': patch
---

fetch:template now accept parameter stripFirstDirectoryFromPath (default=false)

usage sample:

```diff
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: ./template
+       stripFirstDirectoryFromPath: true
        values:
          name: '{{ parameters.name }}'
          owner: '{{ parameters.owner }}'
```
