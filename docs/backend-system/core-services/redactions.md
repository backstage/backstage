---
id: redactions
title: Redactions Service
sidebar_label: Redactions
description: Documentation for the Redactions service
---

This service allows you to redact sensitive information from strings, as well as add information that should be redacted.

## Using the service

The following example shows how you can use the redactions service to remove sensitive information. Note that there is no need to redact messages or fields passed to any logger service, since redaction is already built-in.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        redactions: coreServices.redactions,
      },
      async init({ redactions }) {
        const input = '...';
        const redacted = redactions.redact(input);
      },
    });
  },
});
```

## Configuring the service

No configuration is available for this service.
