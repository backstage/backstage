---
'@backstage/plugin-scaffolder-node': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-node-test-utils': minor
---

**DEPRECATION**: We've deprecated the old way of defining actions using `createTemplateAction` with raw `JSONSchema` and type parameters, as well as using `zod` through an import. You can now use the new format to define `createTemplateActions` with `zod` provided by the framework. This change also removes support for `logStream` in the `context` as well as moving the `logger` to an instance of `LoggerService`.

Before:

```ts
createTemplateAction<{ repoUrl: string }, { test: string }>({
  id: 'test',
  schema: {
    input: {
      type: 'object',
      required: ['repoUrl'],
      properties: {
        repoUrl: { type: 'string' },
      },
    },
    output: {
      type: 'object',
      required: ['test'],
      properties: {
        test: { type: 'string' },
      },
    },
  },
  handler: async ctx => {
    ctx.logStream.write('blob');
  },
});

// or

createTemplateAction({
  id: 'test',
  schema: {
    input: z.object({
      repoUrl: z.string(),
    }),
    output: z.object({
      test: z.string(),
    }),
  },
  handler: async ctx => {
    ctx.logStream.write('something');
  },
});
```

After:

```ts
createTemplateAction({
  id: 'test',
  schema: {
    input: {
      repoUrl: d => d.string(),
    },
    output: {
      test: d => d.string(),
    },
  },
  handler: async ctx => {
    // you can just use ctx.logger.log('...'), or if you really need a log stream you can do this:
    const logStream = new PassThrough();
    logStream.on('data', chunk => {
      ctx.logger.info(chunk.toString());
    });
  },
});
```
