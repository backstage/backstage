---
'@backstage/plugin-scaffolder-node': patch
---

Fixed an issue **(#30613)** where `createTemplateAction` didn't properly handle Zod schemas with `.default()` and `.transform()`. The
following cases are now correctly supported:

- Fields not provided in input but having default values (e.g., `x: z => z.number().default(0)`)
- Transformations via `.transform()` (e.g., `t: z => z.string().transform(val => val.length)`)
- TypeScript no longer incorrectly requires providing fields that Zod treats as optional

Example of corrected behavior:

```ts
const action = createTemplateAction({
  ...,
  schema: {
    input: {
      x: z => z.number().default(0), // Correctly handles transformation
      t: z => z.string().transform(val => val.length), // Correctly handles transformation
    }
  }
});
```

Added tests for:

- Missing input (using default values)
- Custom transformations
