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
 * Helpers for managing integrations towards external systems
 *
 * @packageDocumentation
 */

export * from './awsS3';
export * from './awsCodeCommit';
export * from './azureBlobStorage';
export * from './azure';
export * from './bitbucket';
export * from './bitbucketCloud';
export * from './bitbucketServer';
export * from './gerrit';
export * from './gitea';
export * from './github';
export * from './gitlab';
export * from './googleGcs';
export * from './harness';
export { defaultScmResolveUrl } from './helpers';
export { ScmIntegrations } from './ScmIntegrations';
export type { IntegrationsByType } from './ScmIntegrations';
export type {
  ScmIntegration,
  ScmIntegrationsFactory,
  ScmIntegrationsGroup,
  RateLimitInfo,
} from './types';
export type { ScmIntegrationRegistry } from './registry';
