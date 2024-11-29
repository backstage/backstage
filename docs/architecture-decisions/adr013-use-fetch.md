---
id: adrs-adr013
title: 'ADR013: Proper use of HTTP fetching libraries'
# prettier-ignore
description: Architecture Decision Record (ADR) for the proper use of fetchApiRef, native fetch, and cross-fetch for data fetching.
---

## Context

Using multiple HTTP packages for data fetching increases the complexity and the
support burden of keeping said package up to date.

## Decision

Backend (node) packages should use the native `fetch` for HTTP data fetching,
and importing `undici` where necessary. Example:

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

We will gradually transition away from third party packages such as `axios`,
`got`, `node-fetch` and others.
