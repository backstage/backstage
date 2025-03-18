---
'@backstage/plugin-catalog-backend': patch
---

Updating the default processing time to be 24 hours. This means that entities will refresh once every ~24 hours, but we encourage the use of the events support for different providers to refresh more often and be reactive to changes outside the refresh loop.

You can override the default processing time by providing the following `app-config.yaml`:

```yaml
catalog:
  processingInterval:
    hours: 1
```

Be aware that setting this value too low can cause rate limits, and overloading of upstream services as it will try to refresh the entire catalog in that time.
