---
id: testing
title: Testing Backend Plugins and Modules
sidebar_label: Testing
# prettier-ignore
description: Learn how to test your backend plugins and modules
---

Utilities for testing backend plugins and modules are available in `@backstage/backend-test-utils`.
`startTestBackend` returns a server which can be used together with `supertest` to test the plugins.

```ts
import { startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';

describe('My plugin tests', () => {
  it('should return 200', async () => {
    const { server } = await startTestBackend({
      features: [myPlugin()],
    });

    const response = await request(server).get('/api/example/hello');
    expect(response.status).toBe(200);
  });
});
```
