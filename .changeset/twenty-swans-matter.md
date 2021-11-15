---
'@backstage/core-app-api': patch
---

The `createApp` function from `@backstage/core-app-api` has been deprecated, with two new options being provided as a replacement.

The first and most commonly used one is `createApp` from the new `@backstage/app-defaults` package, which behaves just like the existing `createApp`. In the future this method is likely to be expanded to add more APIs and other pieces into the default setup, for example the Utility APIs from `@backstage/integration-react`.

The other option that we now provide is to use `createSpecializedApp` from `@backstage/core-app-api`. This is a more low-level API where you need to provide a full set of options, including your own `components`, `icons`, `defaultApis`, and `themes`. The `createSpecializedApp` way of creating an app is particularly useful if you are not using `@backstage/core-components` or MUI, as it allows you to avoid those dependencies completely.
