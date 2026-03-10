---
'@backstage/plugin-catalog-node': minor
---

Added the ability for SCM events subscribers to mark the fact that they have taken actions based on events, which produces output metrics:

- `catalog.events.scm.actions` with attribute `action`: Counter for the number of actions actually taken by catalog internals or other subscribers, based on SCM events. The `action` is currently either `create`, `delete`, `refresh`, or `move`.
