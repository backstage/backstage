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

## Providing custom URL readers

You can also create an internal or bespoke reader and provide it to the backend using a service factory. The following example shows how to create a custom URL reader and provide it to the backend.

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
import {
  ReaderFactory,
  urlReaderFactoriesServiceRef,
} from '@backstage/backend-defaults/urlReader';
import {
  createServiceFactory,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

class CustomUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const reader = new CustomUrlReader(config);
    const predicate = (url: URL) => url.host === 'myCustomDomain';
    return [{ reader, predicate }];
  };

  constructor(private readonly config: Config) {}
  // implementations of read, readTree and search methods skipped for this example
}

const customReader = createServiceFactory({
  service: urlReaderFactoriesServiceRef,
  deps: {},
  async factory() {
    return CustomUrlReader.factory;
  },
});

const backend = createBackend();
// backend.add() of other plugins and modules excluded
backend.add(customReader);
```

## Writing URL Readers

We want to make sure all URL Readers behave in the same way. Hence if possible,
all the methods of the `UrlReaderService` interface should be implemented. However it
is okay to start by implementing just one of them and creating issues for the
remaining ones.

You can choose to make new URL Readers open source if the use case is beneficial to other users. Either as its own package or by updating the
[`default` factory](https://github.com/backstage/backstage/blob/ce2ca68f07ad3334401d3277b989bf145b728a64/packages/backend-defaults/src/entrypoints/urlReader/lib/UrlReaders.ts#L82-L102)
method of URL Readers. It's recommended to create an issue in the Backstage repository to discuss the use case and get feedback before starting the implementation of a new core URL Reader.

Here are some general guidelines for writing URL Readers

#### `readUrl`

`readUrl` method expects a user-friendly URL, something which can be copied from
the browser naturally when a person is browsing the provider in their browser.

- ✅ Valid URL :
  `https://github.com/backstage/backstage/blob/master/ADOPTERS.md`
- ❌ Not a valid URL :
  `https://raw.githubusercontent.com/backstage/backstage/master/ADOPTERS.md`
- ❌ Not a valid URL : `https://github.com/backstage/backstage/ADOPTERS.md`

Upon receiving the URL, `readUrl` converts the user-friendly URL into an API URL
which can be used to request the provider's API.

`readUrl` then makes an authenticated request to the provider API and returns the response containing the file's contents and `ETag` (if the provider supports it).

#### `readTree`

`readTree` method also expects user-friendly URLs similar to `read` but the URL
should point to a tree (could be the root of a repository or even a
sub-directory).

- ✅ Valid URL : `https://github.com/backstage/backstage`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master/docs`

Using the provider's API documentation, find out an API endpoint which can be
used to download either a zip or a tarball. You can download the entire tree
(e.g. a repository) and filter out in case the user is expecting only a
sub-tree. But some APIs are smart enough to accept a path and return only a
sub-tree in the downloaded archive.

#### `search`

`search` method expects a glob pattern of a URL and returns a list of files
matching the query.

- ✅ Valid URL :
  `https://github.com/backstage/backstage/blob/master/**/catalog-info.yaml`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master/**/*.md`
- ✅ Valid URL :
  `https://github.com/backstage/backstage/blob/master/*/package.json`
- ✅ Valid URL : `https://github.com/backstage/backstage/blob/master/README`

The core logic of `readTree` can be used here to extract all the files inside
the tree and return the files matching the pattern in the `url`.

### Caching

All of the methods above support ETag based caching. If the method is called
without an ETag, the response contains the ETag of the resource (should ideally
forward the ETag returned by the provider). If the method is called with an
ETag, it first compares the ETag and returns a `NotModifiedError` in case the
resource has not been modified. This approach is very similar to the actual
[`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) and
[`If-None-Match`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
HTTP headers.
