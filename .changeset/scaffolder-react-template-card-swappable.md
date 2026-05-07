---
'@backstage/plugin-scaffolder-react': minor
---

The `TemplateCard` component is now a swappable component. Apps using the new
frontend system can replace it by registering a `SwappableComponentBlueprint`
that targets `TemplateCard.ref`. Existing usage continues to work unchanged.
