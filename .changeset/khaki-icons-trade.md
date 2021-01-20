---
'@backstage/backend-common': patch
---

1. URL Reader's `readTree` method now returns an `etag` in the response along with the blob. The etag is an identifier of the blob and will only change if the blob is modified on the target. Usually it is set to the latest commit SHA on the target.

`readTree` also takes an optional `etag` in its options and throws a `NotModifiedError` if the etag matches with the etag of the resource.

So, the `etag` can be used in building a cache when working with URL Reader.

An example -

```ts
const response = await reader.readTree(
  'https://github.com/backstage/backstage',
);

const etag = response.etag;

// Will throw a new NotModifiedError (exported from @backstage/backstage-common)
await reader.readTree('https://github.com/backstage/backstage', {
  etag,
});
```

2. URL Reader's readTree method can now detect the default branch. So, `url:https://github.com/org/repo/tree/master` can be replaced with `url:https://github.com/org/repo` in places like `backstage.io/techdocs-ref`.
