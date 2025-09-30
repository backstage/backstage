---
'@backstage/plugin-catalog-backend': patch
---

Moved catalog processor and provider disabling and priorities under own config objects.

This is due to issue with some existing providers, such as GitHub, using array syntax for the provider configuration.

The new config format is not backwards compatible, so users will need to update their config files. The new format
is as follows:

```yaml
catalog:
  providerOptions:
    providerA:
      disabled: false
    providerB:
      disabled: true
  processorOptions:
    processorA:
      disabled: false
      priority: 10
    processorB:
      disabled: true
```
