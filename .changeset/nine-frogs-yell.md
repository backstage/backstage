---
'@backstage/plugin-scaffolder': minor
---

Removed the following previously deprecated exports:

- **BREAKING**: Removed the deprecated `TemplateList` component and the `TemplateListProps` type. Please use the `TemplateCard` to create your own list component instead to render these lists.

- **BREAKING**: Removed the deprecated `setSecret` method, please use `setSecrets` instead.

- **BREAKING**: Removed the deprecated `TemplateCardComponent` and `TaskPageComponent` props from the `ScaffolderPage` component. These are now provided using the `components` prop with the shape `{{ TemplateCardComponent: () => JSX.Element, TaskPageComponent: () => JSX.Element }}`
