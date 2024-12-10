---
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-node': patch
---

Allow configuring a timeout for event bus polling requests. This can be set like so in your app-config:

```yaml
events:
  notifyTimeoutMs: 30000
```
