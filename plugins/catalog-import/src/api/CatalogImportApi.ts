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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core-plugin-api';
import { PartialEntity } from '../types';

/**
 * Utility API reference for the {@link CatalogImportApi}.
 *
 * @public
 */
export const catalogImportApiRef = createApiRef<CatalogImportApi>({
  id: 'plugin.catalog-import.service',
});

/**
 * Result of the analysis.
 *
 * @public
 */
export type AnalyzeResult =
  | {
      type: 'locations';
      locations: Array<{
        target: string;
        exists?: boolean;
        entities: CompoundEntityRef[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      generatedEntities: PartialEntity[];
    };

/**
 * API for driving catalog imports.
 *
 * @public
 */
export interface CatalogImportApi {
  analyzeUrl(url: string): Promise<AnalyzeResult>;

  preparePullRequest?(): Promise<{
    title: string;
    body: string;
  }>;

  submitPullRequest(options: {
    repositoryUrl: string;
    fileContent: string;
    title: string;
    body: string;
  }): Promise<{ link: string; location: string }>;
}
