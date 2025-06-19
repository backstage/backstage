---
'@backstage/canon': minor
---

**BREAKING CHANGES**

We’re updating our Button component to provide better support for button links.

- We’re introducing a new `ButtonLink` component, which replaces the previous render prop pattern.
- To maintain naming consistency across components, `IconButton` is being renamed to `ButtonIcon`.
- Additionally, the render prop will be removed from all button-related components.

These changes aim to simplify usage and improve clarity in our component API.
