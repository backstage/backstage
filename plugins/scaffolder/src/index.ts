/*
 * Copyright 2020 The Backstage Authors
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

/**
 * The Backstage plugin that helps you create new things
 *
 * @packageDocumentation
 */

export { scaffolderApiRef, ScaffolderClient } from './api';
export type {
  ListActionsResponse,
  LogEvent,
  ScaffolderApi,
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
  ScaffolderGetIntegrationsListOptions,
  ScaffolderGetIntegrationsListResponse,
  ScaffolderOutputLink,
  ScaffolderScaffoldOptions,
  ScaffolderScaffoldResponse,
  ScaffolderStreamLogsOptions,
  ScaffolderTask,
  ScaffolderTaskOutput,
  ScaffolderTaskStatus,
} from './types';

export { createScaffolderLayout, ScaffolderLayouts } from './layouts';
export type { LayoutOptions, LayoutTemplate, LayoutComponent } from './layouts';
export {
  EntityPickerFieldExtension,
  EntityNamePickerFieldExtension,
  EntityTagsPickerFieldExtension,
  OwnerPickerFieldExtension,
  OwnedEntityPickerFieldExtension,
  RepoUrlPickerFieldExtension,
  ScaffolderPage,
  scaffolderPlugin,
} from './plugin';
export * from './components';

export {
  createScaffolderFieldExtension,
  ScaffolderFieldExtensions,
  rootRouteRef,
  selectedTemplateRouteRef,
  type TemplateParameterSchema,
  type CustomFieldExtensionSchema,
  type CustomFieldValidator,
  type FieldExtensionOptions,
  type FieldExtensionComponentProps,
  type FieldExtensionComponent,
} from '@backstage/plugin-scaffolder-react';

export type { TaskPageProps } from './components/TaskPage';

/** next exports */
export { NextScaffolderPage } from './plugin';
export type { NextRouterProps } from './next';
export type { TemplateGroupFilter } from './next';

// These types in the future can be removed from being exported out of this package and be imported
// instead from @backstage/plugin-scaffolder-react. They have to be redeclared here to keep the alpha
// annotation in order to not polluted the main export surface.
import {
  nextRouteRef as nextRouteRefTemp,
  nextSelectedTemplateRouteRef as nextSelectedTemplateRouteRefTemp,
  createNextScaffolderFieldExtension as createNextScaffolderFieldExtensionTemp,
  type NextCustomFieldValidator as NextCustomFieldValidatorTemp,
  type NextFieldExtensionOptions as NextFieldExtensionOptionsTemp,
  type NextFieldExtensionComponentProps as NextFieldExtensionComponentPropsTemp,
  type FormProps as FormPropsTemp,
} from '@backstage/plugin-scaffolder-react';

/**
 * @alpha
 */
const nextRouteRef = nextRouteRefTemp;
/**
 * @alpha
 */
const nextSelectedTemplateRouteRef = nextSelectedTemplateRouteRefTemp;
/**
 * @alpha
 */
const createNextScaffolderFieldExtension =
  createNextScaffolderFieldExtensionTemp;
/**
 * @alpha
 */
type NextCustomFieldValidator<T> = NextCustomFieldValidatorTemp<T>;
/**
 * @alpha
 */
type NextFieldExtensionOptions<
  TFieldReturnValue = unknown,
  TInputProps = unknown,
> = NextFieldExtensionOptionsTemp<TFieldReturnValue, TInputProps>;
/**
 * @alpha
 */
type NextFieldExtensionComponentProps<
  TFieldReturnValue,
  TUiOptions = {},
> = NextFieldExtensionComponentPropsTemp<TFieldReturnValue, TUiOptions>;
/**
 * @alpha
 */
type FormProps = FormPropsTemp;

export {
  nextRouteRef,
  nextSelectedTemplateRouteRef,
  createNextScaffolderFieldExtension,
  type NextCustomFieldValidator,
  type NextFieldExtensionOptions,
  type NextFieldExtensionComponentProps,
  type FormProps,
};
