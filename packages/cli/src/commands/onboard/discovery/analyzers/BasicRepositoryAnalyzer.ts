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

import { ComponentEntity } from '@backstage/catalog-model';
import { AnalysisOutputs, Analyzer } from './types';
import { Repository } from '../providers/types';

/**
 * Naive analyzer that produces a single entity that represents the repository
 * as a whole.
 */
export class BasicRepositoryAnalyzer implements Analyzer {
  name(): string {
    return BasicRepositoryAnalyzer.name;
  }

  async analyzeRepository(options: {
    repository: Repository;
    output: AnalysisOutputs;
  }): Promise<void> {
    const entity: ComponentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: options.repository.name,
        ...(options.repository.description
          ? { description: options.repository.description }
          : {}),
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'user:guest',
      },
    };

    options.output.produce({
      type: 'entity',
      path: '/',
      entity: entity,
    });
  }
}
