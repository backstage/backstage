---
id: test-case-validation
title: Validate your OpenAPI spec against test data
description: Documentation on how to validate OpenAPI specs against test traffic.
---

## OpenAPI Validation using Test Cases

OpenAPI spec validation is performed by wrapping your test server with `wrapServer` from `@backstage/backend-openapi-utils/testUtils`. This proxy intercepts all requests and responses during tests and validates them against your OpenAPI spec.

When validation errors are found, they can be resolved by either:

1. Fixing the spec manually, which is usually relevant for request body or response body changes.
2. Fixing the test case to use fully populated return values.

Here is a complete example:

```ts
import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
import express from 'express';
import type { Server } from 'node:http';
import request from 'supertest';
import { createRouter } from './router';

describe('createRouter', () => {
  let app: Server;

  beforeAll(async () => {
    const router = await createRouter();
    app = await wrapServer(express().use(router));
  });

  // Bad: the empty object won't satisfy the required properties in the spec,
  // causing the OpenAPI validation proxy to fail the test.
  it('should not use an empty mock', async () => {
    const entity: Entity = {} as any;
    app.get('/test', () => {
      return entity;
    });
    const response = await request(app).get('/test');
    expect(response.body).toEqual(entity);
  });

  // Good: all required properties are present, so the response matches the
  // spec and validation passes.
  it('should return a valid entity', async () => {
    const entity: Entity = {
      apiVersion: 'a1',
      kind: 'k1',
      metadata: { name: 'n1' },
    };
    app.get('/test', () => {
      return entity;
    });
    const response = await request(app).get('/test');
    expect(response.body).toEqual(entity);
  });
});
```
