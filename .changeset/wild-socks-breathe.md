---
'@backstage/plugin-scaffolder': minor
---

- **Deprecation** - Deprecated the following exports, please import them directly from `@backstage/plugin-scaffolder-react` instead

  ```
  createScaffolderFieldExtension
  ScaffolderFieldExtensions
  useTemplateSecrets
  scaffolderApiRef
  ScaffolderApi
  ScaffolderUseTemplateSecrets
  TemplateParameterSchema
  CustomFieldExtensionSchema
  CustomFieldValidator
  FieldExtensionOptions
  FieldExtensionComponentProps
  FieldExtensionComponent
  ListActionsResponse
  LogEvent
  ScaffolderDryRunOptions
  ScaffolderDryRunResponse
  ScaffolderGetIntegrationsListOptions
  ScaffolderGetIntegrationsListResponse
  ScaffolderOutputlink
  ScaffolderScaffoldOptions
  ScaffolderScaffoldResponse
  ScaffolderStreamLogsOptions
  ScaffolderTask
  ScaffolderTaskOutput
  ScaffolderTaskStatus
  ```

- **Deprecation** - Deprecated the `rootRouteRef` export, this should now be used from `scaffolderPlugin.routes.root`

- The following `/alpha` types have removed from this package and moved to the `@backstage/plugin-scaffolder-react/alpha` package

  ```
  createNextScaffolderFieldExtension
  FormProps
  NextCustomFieldValidator
  NextFieldExtensionComponentProps
  NextFieldExtensionOptions
  ```
