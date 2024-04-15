---
'@backstage/config-loader': minor
---

The default environment variable substitution function will now trim whitespace characters from the substituted value. This alleviates bugs where whitespace characters are mistakenly included in environment variables.

If you depend on the old behavior, you can override the default substitution function with your own, for example:

```ts
ConfigSources.default({
  substitutionFunc: async name => process.env[name],
});
```
