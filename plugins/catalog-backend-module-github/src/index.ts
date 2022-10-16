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
 * A Backstage catalog backend module that helps integrate towards GitHub
 *
 * @packageDocumentation
 */

export { GitHubLocationAnalyzer } from './analyzers/GitHubLocationAnalyzer';
export type { GitHubLocationAnalyzerOptions } from './analyzers/GitHubLocationAnalyzer';
export type { GithubMultiOrgConfig } from './lib';
export { GithubDiscoveryProcessor } from './processors/GithubDiscoveryProcessor';
export { GithubMultiOrgReaderProcessor } from './processors/GithubMultiOrgReaderProcessor';
export { GithubOrgReaderProcessor } from './processors/GithubOrgReaderProcessor';
export { GitHubEntityProvider } from './providers/GitHubEntityProvider';
export { GitHubOrgEntityProvider } from './providers/GitHubOrgEntityProvider';
export type { GitHubOrgEntityProviderOptions } from './providers/GitHubOrgEntityProvider';
export { githubEntityProviderCatalogModule } from './service/GithubEntityProviderCatalogModule';
