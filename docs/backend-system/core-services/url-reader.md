---
id: url-reader
title: Url Reader Service
sidebar_label: Url Reader
description: Documentation for the Url Reader service
---

# URL Readers

Plugins will require communication with certain integrations that users have configured. Popular integrations are things like Version Control Systems (VSC), such as GitHub, BitBucket GitLab etc. These integrations are configured in the `integrations` section of the `app-config.yaml` file.

These URL readers are basically wrappers with authentication for files and folders that could be stored in these VCS repositories.

## Using the service

The following example shows how to get the URL Reader service in your `example` backend plugin to read a file and a directory from a GitHub repository.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import os from 'os';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        urlReader: coreServices.urlReader,
      },
      async init({ urlReader }) {
        const buffer = await urlReader
          .read('https://github.com/backstage/backstage/blob/master/README.md')
          .then(r => r.buffer());

        const tmpDir = os.tmpdir();
        const directory = await urlReader
          .readTree(
            'https://github.com/backstage/backstage/tree/master/packages/backend',
          )
          .then(tree => tree.dir({ targetDir: tmpDir }));
      },
    });
  },
});
```
