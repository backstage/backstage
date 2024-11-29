/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This file is here to re-export exports from the `@backage/plugin-scaffolder-react` package to keep backwards compatibility.
 * But mark them as deprecated so that any import that is using these exports will be notified that they should use the `-react` package instead.
 * It's a little awkward to get the deprecated notice to show up in the API report, which is why it's all been extracted out to this file.
 */

import {
  createScaffolderFieldExtension as createScaffolderFieldExtensionTemp,
  ScaffolderFieldExtensions as ScaffolderFieldExtensionsTemp,
  useTemplateSecrets as useTemplateSecretsTemp,
  scaffolderApiRef as scaffolderApiRefTemp,
  createScaffolderLayout as createScaffolderLayoutTemp,
  ScaffolderLayouts as ScaffolderLayoutsTemp,
  type LayoutOptions as LayoutOptionsTemp,
  type LayoutTemplate as LayoutTemplateTemp,
  type ScaffolderApi as ScaffolderApiTemp,
  type ScaffolderUseTemplateSecrets as ScaffolderUseTemplateSecretsTemp,
  type TemplateParameterSchema as TemplateParameterSchemaTemp,
  type CustomFieldExtensionSchema as CustomFieldExtensionSchemaTemp,
  type CustomFieldValidator as CustomFieldValidatorTemp,
  type FieldExtensionOptions as FieldExtensionOptionsTemp,
  type FieldExtensionComponentProps as FieldExtensionComponentPropsTemp,
  type FieldExtensionComponent as FieldExtensionComponentTemp,
  type ListActionsResponse as ListActionsResponseTemp,
  type LogEvent as LogEventTemp,
  type ScaffolderDryRunOptions as ScaffolderDryRunOptionsTemp,
  type ScaffolderDryRunResponse as ScaffolderDryRunResponseTemp,
  type ScaffolderGetIntegrationsListOptions as ScaffolderGetIntegrationsListOptionsTemp,
  type ScaffolderGetIntegrationsListResponse as ScaffolderGetIntegrationsListResponseTemp,
  type ScaffolderOutputLink as ScaffolderOutputLinkTemp,
  type ScaffolderScaffoldOptions as ScaffolderScaffoldOptionsTemp,
  type ScaffolderScaffoldResponse as ScaffolderScaffoldResponseTemp,
  type ScaffolderStreamLogsOptions as ScaffolderStreamLogsOptionsTemp,
  type ScaffolderTask as ScaffolderTaskTemp,
  type ScaffolderTaskOutput as ScaffolderTaskOutputTemp,
  type ScaffolderTaskStatus as ScaffolderTaskStatusTemp,
} from '@backstage/plugin-scaffolder-react';

import { rootRouteRef as rootRouteRefTemp } from './routes';

/**
 * @public
 * @deprecated use import from `{@link @backstage/plugin-scaffolder#scaffolderPlugin}.routes.root` instead.
 */
export const rootRouteRef = rootRouteRefTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#createScaffolderFieldExtension} instead as this has now been moved.
 */
export const createScaffolderFieldExtension =
  createScaffolderFieldExtensionTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderFieldExtensions} instead as this has now been moved.
 */
export const ScaffolderFieldExtensions = ScaffolderFieldExtensionsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#useTemplateSecrets} instead as this has now been moved.
 */
export const useTemplateSecrets = useTemplateSecretsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#scaffolderApiRef} instead as this has now been moved.
 */
export const scaffolderApiRef = scaffolderApiRefTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderApi} instead as this has now been moved.
 */
export type ScaffolderApi = ScaffolderApiTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderUseTemplateSecrets} instead as this has now been moved.
 */
export type ScaffolderUseTemplateSecrets = ScaffolderUseTemplateSecretsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#TemplateParameterSchema} instead as this has now been moved.
 */
export type TemplateParameterSchema = TemplateParameterSchemaTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#CustomFieldExtensionSchema} instead as this has now been moved.
 */
export type CustomFieldExtensionSchema = CustomFieldExtensionSchemaTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#CustomFieldValidator} instead as this has now been moved.
 */
export type CustomFieldValidator<TReturnFieldData> =
  CustomFieldValidatorTemp<TReturnFieldData>;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#FieldExtensionOptions} instead as this has now been moved.
 */
export type FieldExtensionOptions = FieldExtensionOptionsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#FieldExtensionComponentProps} instead as this has now been moved.
 */
export type FieldExtensionComponentProps<
  TFieldReturnValue,
  TUiOptions extends {} = {},
> = FieldExtensionComponentPropsTemp<TFieldReturnValue, TUiOptions>;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#FieldExtensionComponent} instead as this has now been moved.
 */
export type FieldExtensionComponent<_TReturnValue, _TInputProps> =
  FieldExtensionComponentTemp<_TReturnValue, _TInputProps>;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ListActionsResponse} instead as this has now been moved.
 */
export type ListActionsResponse = ListActionsResponseTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#LogEvent} instead as this has now been moved.
 */
export type LogEvent = LogEventTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderDryRunOptions} instead as this has now been moved.
 */
export type ScaffolderDryRunOptions = ScaffolderDryRunOptionsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderDryRunResponse} instead as this has now been moved.
 */
export type ScaffolderDryRunResponse = ScaffolderDryRunResponseTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderGetIntegrationsListOptions} instead as this has now been moved.
 */
export type ScaffolderGetIntegrationsListOptions =
  ScaffolderGetIntegrationsListOptionsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderGetIntegrationsListResponse} instead as this has now been moved.
 */
export type ScaffolderGetIntegrationsListResponse =
  ScaffolderGetIntegrationsListResponseTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderOutputlink} instead as this has now been moved.
 */
export type ScaffolderOutputlink = ScaffolderOutputLinkTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderScaffoldOptions} instead as this has now been moved.
 */
export type ScaffolderScaffoldOptions = ScaffolderScaffoldOptionsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderScaffoldResponse} instead as this has now been moved.
 */
export type ScaffolderScaffoldResponse = ScaffolderScaffoldResponseTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderStreamLogsOptions} instead as this has now been moved.
 */
export type ScaffolderStreamLogsOptions = ScaffolderStreamLogsOptionsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderTask} instead as this has now been moved.
 */
export type ScaffolderTask = ScaffolderTaskTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderTaskOutput} instead as this has now been moved.
 */
export type ScaffolderTaskOutput = ScaffolderTaskOutputTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderTaskStatus} instead as this has now been moved.
 */
export type ScaffolderTaskStatus = ScaffolderTaskStatusTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#createScaffolderLayout} instead as this has now been moved.
 */
export const createScaffolderLayout = createScaffolderLayoutTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#ScaffolderLayouts} instead as this has now been moved.
 */
export const ScaffolderLayouts = ScaffolderLayoutsTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#LayoutTemplate} instead as this has now been moved.
 */
export type LayoutTemplate = LayoutTemplateTemp;
/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-react#LayoutOptions} instead as this has now been moved.
 */
export type LayoutOptions = LayoutOptionsTemp;

/**
 * TaskPageProps for constructing a TaskPage
 * @public
 * @deprecated - this is a useless type that is no longer used.
 */
export type TaskPageProps = {
  // Optional loading text shown before a task begins executing.
  loadingText?: string;
};
