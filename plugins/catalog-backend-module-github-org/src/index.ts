/*
 * Copyright 2023 The Backstage Authors
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
 * The github-org backend module for the catalog plugin.
 *
 * @packageDocumentation
 */
export {
  catalogModuleGithubOrgEntityProvider as default,
  type GithubOrgEntityProviderTransformsExtensionPoint,
  githubOrgEntityProviderTransformsExtensionPoint,
} from './module';
/**
 *
 * TODO(djamaile): GithubMultiOrgEntityProvider should be mirgated over to this module.
 * Afterwards, mark it as deprecated in catalog-backend-module-github and export them there from this module.
 */
export {
  GithubMultiOrgEntityProvider,
  type TeamTransformer,
  type UserTransformer,
} from '@backstage/plugin-catalog-backend-module-github';
