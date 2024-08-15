---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-test-utils': patch
---

Added support for being able to override extension definitions.

```tsx
const TestCard = EntityCardBlueprint.make({
  ...
});

TestCard.override({
  // override attachment points
  attachTo: { id: 'something-else', input: 'overridden' },
  // extend the config schema
  config: {
    schema: {
      newConfig: z => z.string().optional(),
    }
  },
  // override factory
  *factory(originalFactory, { inputs, config }){
    const originalOutput = originalFactory();

    yield coreExentsionData.reactElement(
      <Wrapping>
        {originalOutput.get(coreExentsionData.reactElement)}
      </Wrapping>
    );
  }
});

```
