---
'@backstage/plugin-catalog-backend': patch
---

Externalize repository processing for BitbucketDiscoveryProcessor.

Add an extension point where you can customize how a matched Bitbucket repository should
be processed. This can for example be used if you want to generate the catalog-info.yaml
automatically based on other files in a repository, while taking advantage of the
build-in repository crawling functionality.

`BitbucketDiscoveryProcessor.fromConfig` now takes an optional parameter `options.parser` where
you can customize the logic for each repository found. The default parser has the same
behaviour as before, where it emits an optional location for the matched repository
and lets the other processors take care of further processing.

```typescript
const customRepositoryParser: BitbucketRepositoryParser = async function* customRepositoryParser({
  client,
  repository,
}) {
  // Custom logic for interpret the matching repository.
  // See defaultRepositoryParser for an example
};

const processor = BitbucketDiscoveryProcessor.fromConfig(env.config, {
  parser: customRepositoryParser,
  logger: env.logger,
});
```
