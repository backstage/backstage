---
'@backstage/plugin-scaffolder': minor
---

Removed the following previously deprecated exports:

- **BREAKING**: Removed the deprecated `TemplateList` component and the `TemplateListProps` type. Please use the `TemplateCard` to create your own list component instead to render these lists.

- **BREAKING**: Removed the deprecated `setSecret` method, please use `setSecrets` instead.

- **BREAKING**: Removed the deprecated `TemplateCardComponent` and `TaskPageComponent` props from the `ScaffolderPage` component. These are now provided using the `components` prop with the shape `{{ TemplateCardComponent: () => JSX.Element, TaskPageComponent: () => JSX.Element }}`

- **BREAKING**: Removed `JobStatus` as this type was actually a legacy type used in `v1alpha` templates and the workflow engine and should no longer be used or depended on.
