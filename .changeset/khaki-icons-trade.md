---
'@backstage/backend-common': patch
---

1. URL Reader's `readTree` method now returns a `sha` in the response along with the blob. The SHA belongs to the latest commit on the target. `readTree` also takes an optional `sha` in its options and throws a `NotModifiedError` if the SHA matches with the latest commit SHA on the url's target. This can be used in building a cache when working with URL Reader.

An example -

```ts
const response = await reader.readTree(
  'https://github.com/backstage/backstage',
);

const commitSha = response.sha;

// Will throw a new NotModifiedError (exported from @backstage/backstage-common)
await reader.readTree('https://github.com/backstage/backstage', {
  sha: commitSha,
});
```

2. URL Reader's readTree method can now detect the default branch. So, `url:https://github.com/org/repo/tree/master` can be replaced with `url:https://github.com/org/repo` in places like `backstage.io/techdocs-ref`.
