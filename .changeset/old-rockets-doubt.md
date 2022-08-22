---
'@backstage/backend-common': patch
---

Added port ranges in allowed hosts:

```yaml
reading:
    allow:
      - host: *.examples.org:900-1000
```
