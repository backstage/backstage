---
id: writing-tests-for-actions
title: Writing Tests For Actions
description: How to write tests for actions
---

# Unit Testing Custom Actions

Unit tests help prevent regressions in custom action functionality. The `createTemplateAction` function that is the core of a custom action can be difficult to mock. There are helper methods that can assist.

## Mocking the Context

The `handler` property of the `createTemplateAction` input object expects a context. You can create a mock context using the code below:

```typescript
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

const mockContext = createMockActionContext({
  input: { repoUrl: 'dev.azure.com?repo=repo&owner=owner&organization=org' },
});

await action.handler(mockContext);

expect(mockContext.output).toHaveBeenCalledWith(
  'remoteUrl',
  'https://dev.azure.com/organization/project/_git/repo',
);
```

### Mocking a Workspace within the Context object

If you would like to call `createMockActionContext` inside `it`, you have to
provide a `workspacePath`. By default, `createMockActionContext` uses
`createMockDirectory` from `@backstage/backend-test-utils` to create one for
you. You can use the code below to customize the `workspacePath` without using
the default workspace of the `createMockActionContext` function.

```typescript
describe('github:autolinks:create', async () => {
  const mockDir = createMockDirectory();

  beforeEach(mockDir.clear);

  it('should call the githubApis for creating alphanumeric autolink reference', async () => {
    // ...
    await action.handler(
      createMockActionContext({
        input: {
          repoUrl: 'github.com?repo=repo&owner=owner',
          keyPrefix: 'TICKET-',
          urlTemplate: 'https://example.com/TICKET?query=<num>',
        },
        workspacePath: mockDir.resolve('workspace'),
      }),
    );
    //...
  });
});
```

### How many mock directories to create

A test file should typically create only one `createMockDirectory` and organize
different fixtures as folders inside it. Use `setContent` or `addContent` to
set up the data each individual test needs, and call `mockDir.clear` in
`beforeEach` to reset between tests.

```typescript
describe('my-action', () => {
  const mockDir = createMockDirectory();

  beforeEach(mockDir.clear);

  it('should handle JSON input', async () => {
    mockDir.setContent({
      'workspace/data.json': '{ "key": "value" }',
    });
    // ... use mockDir.resolve('workspace') as workspacePath
  });

  it('should handle YAML input', async () => {
    mockDir.setContent({
      'workspace/data.yaml': 'key: value',
    });
    // ... use mockDir.resolve('workspace') as workspacePath
  });
});
```

Multiple `createMockDirectory` calls are fine when a test file genuinely needs
distinct directory categories at the same time, for example a source directory
and an output directory. Do not call `createMockDirectory` once per test case —
this creates unnecessary temporary directories and slows down the test suite.

## Mocking a Config Core Service

If your custom Action requires the Config Core Service within execution of the `handler(ctx)` such as the custom action below, mocking the context object can be done by building a `mockContext` with the `ConfigReader` function within the `@backstage/config` package.

```typescript
// custom-action.ts
import { Config } from '@backstage/config';

export const customActionRequiringConfigCoreService = (config: Config) => {
  const fieldRequiringValueFromConfig = config.getString('app.service.url');
  return createTemplateAction({
    ...
    async handler(ctx) {
      // Some code requiring the config const
      ctx.logger.info(fieldRequiringValueFromConfig);
    }
  })
}
```

```typescript
// custom-action.test.ts
import { ConfigReader } from '@backstage/config';
import { customActionRequiringConfigCoreService } from './custom-action.ts';
...
const mockConfig = new ConfigReader({
  app: {
    service: {
      url: 'https://api.service.io/graphql',
      apiKeyId: '123',
      apiKeySecret: '123abc',
    },
  },
});
...
const action = customActionRequiringConfigCoreService(mockConfig);
await action.handler({
  ...mockContext
})
```

## Mocking a Cache Core Service

Similar to the `Mocking a Config Core Service` section above, if your custom action expects a Cache Core Service Object as part of the function input, you can mock it out with the following:

```typescript
import { CacheService } from '@backstage/backend-plugin-api';

const mockCacheServiceMethods = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

const mockCacheService = mockCacheServiceMethods as unknown as CacheService;

const action = customActionRequiringCacheCoreService(mockCacheService);
...
```
