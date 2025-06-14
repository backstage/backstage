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

import {
  type ScaffolderApi as _ScaffolderApi,
  type ScaffolderDryRunOptions as _ScaffolderDryRunOptions,
  type ScaffolderDryRunResponse as _ScaffolderDryRunResponse,
  type ScaffolderGetIntegrationsListOptions as _ScaffolderGetIntegrationsListOptions,
  type ScaffolderGetIntegrationsListResponse as _ScaffolderGetIntegrationsListResponse,
  type ScaffolderScaffoldOptions as _ScaffolderScaffoldOptions,
  type ScaffolderScaffoldResponse as _ScaffolderScaffoldResponse,
  type ScaffolderStreamLogsOptions as _ScaffolderStreamLogsOptions,
  type ScaffolderUsageExample as _ScaffolderUsageExample,
  type Action as _Action,
  type ListActionsResponse as _ListActionsResponse,
  type ListTemplatingExtensionsResponse as _ListTemplatingExtensionsResponse,
  type LogEvent as _LogEvent,
  type ScaffolderOutputLink as _ScaffolderOutputLink,
  type ScaffolderOutputText as _ScaffolderOutputText,
  type ScaffolderTask as _ScaffolderTask,
  type ScaffolderTaskOutput as _ScaffolderTaskOutput,
  type ScaffolderTaskStatus as _ScaffolderTaskStatus,
  type TemplateFilter as _TemplateFilter,
  type TemplateGlobalFunction as _TemplateGlobalFunction,
  type TemplateGlobalValue as _TemplateGlobalValue,
} from '@backstage/plugin-scaffolder-common';

/**
 * The status of each task in a Scaffolder Job
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderTaskStatus} instead as this has now been moved.
 */
export type ScaffolderTaskStatus = _ScaffolderTaskStatus;

/**
 * The shape of each task returned from the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderTask} instead as this has now been moved.
 */
export type ScaffolderTask = _ScaffolderTask;

/**
 * A single scaffolder usage example
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderUsageExample} instead as this has now been moved.
 */
export type ScaffolderUsageExample = _ScaffolderUsageExample;

/**
 * A single action example
 *
 * @public
 * @deprecated in favor of ScaffolderUsageExample
 */
export type ActionExample = ScaffolderUsageExample;

/**
 * The response shape for a single action in the `listActions` call to the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#Action} instead as this has now been moved.
 */
export type Action = _Action;

/**
 * The response shape for the `listActions` call to the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ListActionsResponse} instead as this has now been moved.
 */
export type ListActionsResponse = _ListActionsResponse;

/**
 * The response shape for a single filter in the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#TemplateFilter} instead as this has now been moved.
 */
export type TemplateFilter = _TemplateFilter;

/**
 * The response shape for a single global function in the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#TemplateGlobalFunction} instead as this has now been moved.
 */
export type TemplateGlobalFunction = _TemplateGlobalFunction;

/**
 * The response shape for a single global value in the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#TemplateGlobalValue} instead as this has now been moved.
 */
export type TemplateGlobalValue = _TemplateGlobalValue;

/**
 * The response shape for the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ListTemplatingExtensionsResponse} instead as this has now been moved.
 */
export type ListTemplatingExtensionsResponse =
  _ListTemplatingExtensionsResponse;

/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderOutputLink} instead as this has now been moved.
 */
export type ScaffolderOutputLink = _ScaffolderOutputLink;

/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderOutputText} instead as this has now been moved.
 */
export type ScaffolderOutputText = _ScaffolderOutputText;

/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderTaskOutput} instead as this has now been moved.
 */
export type ScaffolderTaskOutput = _ScaffolderTaskOutput;

/**
 * The shape of a `LogEvent` message from the `scaffolder-backend`
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#LogEvent} instead as this has now been moved.
 */
export type LogEvent = _LogEvent;

/**
 * The input options to the `scaffold` method of the `ScaffolderClient`.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderScaffoldOptions} instead as this has now been moved.
 */
export type ScaffolderScaffoldOptions = _ScaffolderScaffoldOptions;

/**
 * The response shape of the `scaffold` method of the `ScaffolderClient`.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderScaffoldResponse} instead as this has now been moved.
 */
export type ScaffolderScaffoldResponse = _ScaffolderScaffoldResponse;

/**
 * The arguments for `getIntegrationsList`.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderGetIntegrationsListOptions} instead as this has now been moved.
 */
export type ScaffolderGetIntegrationsListOptions =
  _ScaffolderGetIntegrationsListOptions;

/**
 * The response shape for `getIntegrationsList`.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderGetIntegrationsListResponse} instead as this has now been moved.
 */
export type ScaffolderGetIntegrationsListResponse =
  _ScaffolderGetIntegrationsListResponse;

/**
 * The input options to the `streamLogs` method of the `ScaffolderClient`.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderStreamLogsOptions} instead as this has now been moved.
 */
export type ScaffolderStreamLogsOptions = _ScaffolderStreamLogsOptions;

/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderDryRunOptions} instead as this has now been moved.
 */
export type ScaffolderDryRunOptions = _ScaffolderDryRunOptions;

/**
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderDryRunResponse} instead as this has now been moved.
 */
export type ScaffolderDryRunResponse = _ScaffolderDryRunResponse;

/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderApi} instead as this has now been moved.
 */
export type ScaffolderApi = _ScaffolderApi;
