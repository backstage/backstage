---
id: adrs-adr007
title: ADR007: Use MSW to mock http requests
description: Architecture Decision Record (ADR) log on Use MSW to mock http requests
---

## Context

Network request mocking can be a total pain sometimes, in all different types of
tests, unit tests to e2e tests always have their own implementation of mocking
these requests. There's been traction in the outer community towards using this
library to mock network requests by using an express style declaration for
routes. react-testing-library suggests using this library instead of mocking
fetch directly whether this be in a browser or in node.

https://github.com/mswjs/msw

## Decision

Moving forward, we have decided that any `fetch` or `XMLHTTPRequest` that
happens, should be mocked by using `msw`.

Here is an example:

```ts
import { setupWorker, rest } from 'msw';

const worker = setupWorker(
  rest.get('*/user/:userId', (req, res, ctx) => {
    return res(
      ctx.json({
        firstName: 'John',
        lastName: 'Maverick',
      }),
    );
  }),
);

// Start the Mock Service Worker
worker.start();
```

and in a more real life scenario, taken from
[CatalogClient.test.ts](https://github.com/backstage/backstage/blob/f3245c4f8f0b6b2625c4a6d5d50161b612fb4757/plugins/catalog/src/api/CatalogClient.test.ts)

```ts
beforeEach(() => {
  server.use(
    rest.get(`${mockApiOrigin}${mockBasePath}/entities`, (_, res, ctx) => {
      return res(ctx.json(defaultResponse));
    }),
  );
});

it('should entities from correct endpoint', async () => {
  const entities = await client.getEntities();
  expect(entities).toEqual(defaultResponse);
});
```

## Consequences

- A little more code to write
- Gradually will replace the codebase with `msw`
