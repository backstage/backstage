---
'@backstage/plugin-scaffolder-node': minor
---

**BREAKING CHANGES**

The legacy methods to define `createTemplateActions` have been replaced with the new native `zod` approaches for defining input and output schemas.

You can migrate actions that look like the following with the below examples:

```ts
// really old legacy json schema
createTemplateAction<{ repoUrl: string }, { repoOutput: string }>({
  id: 'test',
  schema: {
    input: {
      type: 'object'
      required: ['repoUrl']
      properties: {
        repoUrl: {
          type: 'string',
          description: 'repository url description'
        }
      }
    }
  }
});

// old zod method
createTemplateAction({
  id: 'test'
  schema: {
    input: {
      repoUrl: z.string({ description: 'repository url description' })
    }
  }
})

// new method:
createTemplateAction({
  id: 'test',
  schema: {
    input: {
      repoUrl: z => z.string({ description: 'repository url description' })
    }
  }
})

// or for more complex zod types like unions
createTemplateAction({
  id: 'test',
  schema: {
    input: z => z.object({
      repoUrl: z.string({ description: 'repository url description' })
    })
  }
})
```

This breaking change also means that `logStream` has been removed entirely from `ActionsContext`, and that the `logger` is now just a `LoggerService` implementation instead. There is no replacement for the `logStream`, if you wish to still keep using a `logStream` we recommend that you create your own stream that writes to `ctx.logger` instead.
