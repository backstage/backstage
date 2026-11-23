---
'@backstage/plugin-scaffolder-react': minor
---

The review step now masks a field whenever any parameter step marks it as a password or secret, or sets a review mask for it. This includes steps hidden by a `when` condition, and no longer depends on which step declares the field first.

Custom review step components now also receive the complete form state as `schemaFormState` and all parameter steps, including hidden ones, as `allSteps`. Forward these to `ReviewState` as `schemaFormState` and `maskSchemas` to keep the same masking behavior as the built-in review step. The steps passed to custom review step components are now typed with their `title`, so they can be passed to `ReviewState` as `schemas` without a type error. Code that builds these props by hand, for example in tests, now needs to include a `title` for each step.
