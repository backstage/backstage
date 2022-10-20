---
'@backstage/plugin-scaffolder': patch
---

Basic analytics instrumentation is now in place:

- As users make their way through template steps, a `click` event is fired, including the step number.
- After a user clicks "Create" a `create` event is fired, including the name of the software that was just created. The template used at creation is set on the `entityRef` context key.
