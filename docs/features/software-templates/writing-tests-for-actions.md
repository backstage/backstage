---
id: writing-tests-for-actions
title: Writing Tests For Actions
description: How to write tests for actions
---

Once you created a new action, your own custom one, or you would like to contribute new actions, you have to cover it with
Unit tests to be sure that your actions do what they suppose to do.

Make sure that you cover the most of scenario's, which could happen with the action.
One of indispensable part of the test is to supply the context to a handler of action for the execution.
We encourage you to use a utility method for that, so your tests are immune to structural changes of context.
What is inevitably going to happen during the time.

Example how to use it:

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

One thing to be aware about: if you would like to call `createMockActionContext` inside `it`,
you have to provide a `workspacePath`. By default, `createMockActionContext` uses
`import { createMockDirectory } from '@backstage/backend-test-utils';` to create it for you.
This implementation contains a hook inside which creates this limitation. So in this case you can do then:

```typescript
describe('github:autolinks:create', async () => {
  const workspacePath = createMockDirectory().resolve('workspace');
  // ...

  it('should call the githubApis for creating alphanumeric autolink reference', async () => {
    // ...
    await action.handler(
      createMockActionContext({
        input: {
          repoUrl: 'github.com?repo=repo&owner=owner',
          keyPrefix: 'TICKET-',
          urlTemplate: 'https://example.com/TICKET?query=<num>',
        },
        workspacePath,
      }),
    );
    //...
  });
});
```
