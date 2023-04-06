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
 * A Backstage catalog backend module that helps integrate towards Github
 *
 * @packageDocumentation
 */

export { GithubLocationAnalyzer } from './analyzers/GithubLocationAnalyzer';
export type { GithubLocationAnalyzerOptions } from './analyzers/GithubLocationAnalyzer';
export { GithubDiscoveryProcessor } from './processors/GithubDiscoveryProcessor';
export { GithubMultiOrgReaderProcessor } from './processors/GithubMultiOrgReaderProcessor';
export { GithubOrgReaderProcessor } from './processors/GithubOrgReaderProcessor';
export { GithubEntityProvider } from './providers/GithubEntityProvider';
export { GithubOrgEntityProvider } from './providers/GithubOrgEntityProvider';
export type { GithubOrgEntityProviderOptions } from './providers/GithubOrgEntityProvider';
export {
  type GithubMultiOrgConfig,
  type GithubTeam,
  type GithubUser,
  type UserTransformer,
  defaultUserTransformer,
  type TeamTransformer,
  defaultOrganizationTeamTransformer,
  type TransformerContext,
} from './lib';

export * from './deprecated';
