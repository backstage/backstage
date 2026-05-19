---
'@backstage/plugin-scaffolder-react': minor
---

The `TemplateCard` component is now a swappable component. Apps using the new
frontend system can replace it by registering a `SwappableComponentBlueprint`
that targets `TemplateCard`. Components used as the swappable implementation
receive `TemplateCardComponentProps`, where `onSelected` is a zero-argument
callback bound to the rendered template. Existing usage continues to work
unchanged.
