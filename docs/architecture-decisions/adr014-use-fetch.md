---
id: adrs-adr014
title: 'ADR014: Proper use of HTTP fetching libraries'
# prettier-ignore
description: Architecture Decision Record (ADR) for the proper use of fetchApiRef, native fetch, and cross-fetch for data fetching.
---

## Context

Until now we have been recommending the use of `node-fetch` in Node.js contexts
through [ADR013](./adr013-use-node-fetch.md). Since then, Backstage has had its
minimum requirements upgraded to Node.js 20 or newer. The Node.js platform has
established a stable, reliable `undici` based native `fetch` in these versions.
Additionally, there are [some issues](https://github.com/backstage/backstage/issues/24590)
with using third party libraries that only appeared in newer versions of
Node.js.

## Decision

All code that is executed in Node.js (including backend and CLIs) should use the
native `fetch` for HTTP data fetching, and `typeof fetch` as the TypeScript type
in code where a `fetch` implementation can be injected or is referred to.
Example:

```ts
import { ResponseError } from '@backstage/errors';

// this is implicitly global.fetch
const response = await fetch('https://example.com/api/v1/users.json');
if (!response.ok) {
  throw await ResponseError.fromResponse(response);
}
const users = await response.json();
```

Frontend plugins and packages should prefer to use the
[`fetchApiRef`](https://backstage.io/docs/reference/core-plugin-api.fetchapiref).

```ts
import { useApi } from '@backstage/core-plugin-api';

// Inside some React component...
const { fetch } = useApi(fetchApiRef);

const response = await fetch('https://example.com/api/v1/users.json');
if (!response.ok) {
  throw await ResponseError.fromResponse(response);
}
const users = await response.json();
```

Isomorphic packages should have a dependency on the `cross-fetch` package for
mocking and type definitions. Preferably, classes and functions in isomorphic
packages should accept an argument of type `typeof fetch` to let callers supply
their preferred implementation of `fetch`. This lets them adorn the calls with
auth or other information, and track metrics etc, in a cross-platform way.
Example:

```ts
import crossFetch from 'cross-fetch';

export class MyClient {
  private readonly fetch: typeof crossFetch;

  constructor(options: { fetch?: typeof crossFetch }) {
    this.fetch = options.fetch || crossFetch;
  }

  async users() {
    return await this.fetch('https://example.com/api/v1/users.json');
  }
}
```

## Consequences

We will gradually transition away from third party `fetch` replacement packages
such as `node-fetch` and others on the Node.js platform.

The `@mswjs/interceptors` library as used by `msw` version 1.x [does not support native fetch properly](https://github.com/mswjs/msw/issues/1563#issuecomment-1694249010) and likely never will. When you switch to using native fetch, you may see `msw` based tests start to fail to both capture and block traffic. Certain tests may need to be rewritten to use `msw` 2.x or newer instead, which uses a newer version of the interceptors.
