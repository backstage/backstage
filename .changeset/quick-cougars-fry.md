---
'@backstage/plugin-home': patch
---

Improve Starred Entities UI to reduce whitespace and provide more context on the entities:

- Use the Entity Presentation API (via `<EntityDisplayName>`) to display the entity's name
- Component's `kind` and `spec.type` are displayed as a secondary text
- List items are condensed to reduce unnecessary spacing
