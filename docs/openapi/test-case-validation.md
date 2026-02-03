---
id: test-case-validation
title: Validate your OpenAPI spec against test data
description: Documentation on how to use the `repo schema openapi test` command.
---

## OpenAPI Validation using Test Cases

This is primarily performed by `backstage-repo-tools repo schema openapi test`. Any errors found in the generated specs can be either

1. Fixed manually, this is usually relevant for request body or response body changes.
2. Fixed automatically with `backstage-repo-tools repo schema openapi test --update`.
3. Fixing the test case. This can happen where a response is mocked as

```ts
it('should return the right value', () => {
  // We will assume that this is the actual response and update the spec accordingly.
  // Ideally, this should be a fully populated return value.
  const entity: Entity = {} as any;
  app.get('/test', () => {
    return entity;
  });
  const response = await request(app).get('/test');
  expect(response.body).toEqual(entity);
});
```

will cause an invalid spec validation. The return value doesn't have all properties as defined in the type. Try to avoid this if possible. Something better would be,

```ts
it('should return the right value', () => {
  // We will assume that this is the actual response and update the spec accordingly.
  // Ideally, this should be a fully populated return value.
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
```

Additionally, for more advanced use cases, you can run `yarn optic capture {PATH_TO_OPENAPI_FILE} --update interactive` and go through the prompts on the screen. Under the hood, the test validation + updating is done by [Optic](https://github.com/opticdev/optic), a great project around supporting OpenAPI specs and development. You can find additional options [here](https://www.useoptic.com/docs/verify-openapi).
