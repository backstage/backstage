/*
 * Copyright 2025 The Backstage Authors
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
import { buildProcessorGraph } from './util.ts';
import { mockServices } from '@backstage/backend-test-utils';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { ConfigReader } from '@backstage/config';

describe('buildProcessorGraph', () => {
  it('should return an empty array when no processors are provided', () => {
    const result = buildProcessorGraph([], mockServices.rootConfig.mock());
    expect(result).toEqual([]);
  });

  it('should return processors in the dependency order', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
    };
    const processorB: CatalogProcessor = {
      getProcessorName: () => 'B',
      getDependencies: () => ['A'],
    };
    const processors = [processorB, processorA];
    const result = buildProcessorGraph(
      processors,
      mockServices.rootConfig.mock(),
    );
    expect(result).toEqual([processorA, processorB]);
  });

  it('should throw an error for circular dependencies', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
      getDependencies: () => ['B'],
    };
    const processorB: CatalogProcessor = {
      getProcessorName: () => 'B',
      getDependencies: () => ['A'],
    };
    const processors = [processorA, processorB];

    expect(() => {
      buildProcessorGraph(processors, mockServices.rootConfig.mock());
    }).toThrow('Circular dependency detected between processors A and B');
  });

  it('should throw an error for self-referencing dependencies', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
      getDependencies: () => ['A'],
    };
    const processors = [processorA];

    expect(() => {
      buildProcessorGraph(processors, mockServices.rootConfig.mock());
    }).toThrow('Processor A cannot depend on itself');
  });

  it('should throw error on longer circular dependencies', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
      getDependencies: () => ['C'],
    };
    const processorB: CatalogProcessor = {
      getProcessorName: () => 'B',
      getDependencies: () => ['A'],
    };
    const processorC: CatalogProcessor = {
      getProcessorName: () => 'C',
      getDependencies: () => ['B'],
    };
    const processors = [processorA, processorB, processorC];
    expect(() => {
      buildProcessorGraph(processors, mockServices.rootConfig.mock());
    }).toThrow('Circular dependency detected between processors A and C');
  });

  it('should handle multiple dependencies correctly', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
    };
    const processorB: CatalogProcessor = {
      getProcessorName: () => 'B',
      getDependencies: () => ['A'],
    };
    const processorC: CatalogProcessor = {
      getProcessorName: () => 'C',
      getDependencies: () => ['A', 'B'],
    };
    const processorD: CatalogProcessor = {
      getProcessorName: () => 'D',
    };
    const processorE: CatalogProcessor = {
      getProcessorName: () => 'E',
    };
    const processors = [
      processorE,
      processorC,
      processorB,
      processorD,
      processorA,
    ];
    const result = buildProcessorGraph(
      processors,
      mockServices.rootConfig.mock(),
    );
    expect(result).toEqual([
      processorE,
      processorA,
      processorB,
      processorC,
      processorD,
    ]);
  });

  it('should throw an error if invalid processor dependencies are specified', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
      getDependencies: () => ['B'],
    };
    const processors = [processorA];
    expect(() => {
      buildProcessorGraph(processors, mockServices.rootConfig.mock());
    }).toThrow('Processor A depends on unknown processor B');
  });

  it('config should override processor dependencies', () => {
    const processorA: CatalogProcessor = {
      getProcessorName: () => 'A',
    };
    const processorB: CatalogProcessor = {
      getProcessorName: () => 'B',
    };
    const processors = [processorB, processorA];

    const config = new ConfigReader({
      catalog: {
        processors: {
          B: {
            dependencies: ['A'],
          },
        },
      },
    });

    const result = buildProcessorGraph(processors, config);
    expect(result).toEqual([processorA, processorB]);
  });
});
