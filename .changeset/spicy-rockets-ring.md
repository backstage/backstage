---
'@backstage/plugin-scaffolder-backend': patch
---

Added support for configuring the working directory of the Scaffolder:

```yaml
backend:
  workingDirectory: /some-dir # Use this to configure a working directory for the scaffolder, defaults to the OS temp-dir
```
