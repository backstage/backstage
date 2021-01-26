/*
 * Copyright 2020 Spotify AB
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

import { createApiRef } from '@backstage/core';
import { PartialEntity } from '../util/types';
import { GitHubIntegrationConfig } from '@backstage/integration';

export const catalogImportApiRef = createApiRef<CatalogImportApi>({
  id: 'plugin.catalog-import.service',
  description: 'Used by the catalog import plugin to make requests',
});

export interface CatalogImportApi {
  submitPrToRepo(options: {
    owner: string;
    repo: string;
    fileContent: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<{ link: string; location: string }>;
  checkForExistingCatalogInfo(options: {
    owner: string;
    repo: string;
    githubIntegrationConfig: GitHubIntegrationConfig;
  }): Promise<{ exists: boolean; url?: string }>;
  createRepositoryLocation(options: { location: string }): Promise<void>;
  generateEntityDefinitions(options: {
    repo: string;
  }): Promise<PartialEntity[]>;
}
