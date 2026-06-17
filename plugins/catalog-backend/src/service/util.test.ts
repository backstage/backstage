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

import { mockServices } from '@backstage/backend-test-utils';
import { filterAndSortProcessors, filterProviders } from './util';

describe('filterAndSortProcessors', () => {
  it('should filter processors', () => {
    const p1 = { getProcessorName: () => 'processor1' };
    const p2 = { getProcessorName: () => 'processor2' };

    expect(
      filterAndSortProcessors([p1, p2], mockServices.rootConfig({ data: {} })),
    ).toEqual([p1, p2]);

    expect(
      filterAndSortProcessors(
        [p1, p2],
        mockServices.rootConfig({
          data: {
            catalog: {
              processorOptions: {
                processor1: { disabled: true },
              },
            },
          },
        }),
      ),
    ).toEqual([p2]);

    expect(
      filterAndSortProcessors(
        [p1, p2],
        mockServices.rootConfig({
          data: {
            catalog: {
              processorOptions: {
                processor2: { disabled: true },
              },
            },
          },
        }),
      ),
    ).toEqual([p1]);
  });

  it('should sort processors', () => {
    const p1 = { getProcessorName: () => 'processor1', getPriority: () => 10 };
    const p2 = { getProcessorName: () => 'processor2' };
    const p3 = {
      getProcessorName: () => 'processor3',
      getPriority: () => {
        throw new Error('failed');
      },
    };

    expect(
      filterAndSortProcessors(
        [p1, p2, p3],
        mockServices.rootConfig({ data: {} }),
      ),
    ).toEqual([p1, p2, p3]); // p2 and p3 got the defaults

    expect(
      filterAndSortProcessors(
        [p1, p2, p3],
        mockServices.rootConfig({
          data: {
            catalog: {
              processorOptions: {
                processor2: { priority: 2 },
                processor3: { priority: 1 },
              },
            },
          },
        }),
      ),
    ).toEqual([p3, p2, p1]);
  });

  it('rejects invalid config', () => {
    const p1 = { getProcessorName: () => 'processor1' };
    const p2 = { getProcessorName: () => 'processor1' };

    expect(() =>
      filterAndSortProcessors(
        [p1, p2],
        mockServices.rootConfig({
          data: {
            catalog: {
              processorOptions: {
                processor1: { disabled: 'i guess so, maybe' },
              },
            },
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unable to convert config value for key 'catalog.processorOptions.processor1.disabled' in 'mock-config' to a boolean"`,
    );

    expect(() =>
      filterAndSortProcessors(
        [p1, p2],
        mockServices.rootConfig({
          data: {
            catalog: {
              processorOptions: {
                processor1: { priority: 'somewhere in the middle, roughly' },
              },
            },
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unable to convert config value for key 'catalog.processorOptions.processor1.priority' in 'mock-config' to a number"`,
    );
  });
});

describe('filterProviders', () => {
  it('should filter providers', () => {
    const p1 = { getProviderName: () => 'provider1', connect: jest.fn() };
    const p2 = { getProviderName: () => 'provider2', connect: jest.fn() };
    const e1 = { provider: p1 };
    const e2 = { provider: p2 };

    expect(
      filterProviders([e1, e2], mockServices.rootConfig({ data: {} })),
    ).toEqual([e1, e2]);

    expect(
      filterProviders(
        [e1, e2],
        mockServices.rootConfig({
          data: {
            catalog: {
              providerOptions: {
                provider1: { disabled: true },
              },
            },
          },
        }),
      ),
    ).toEqual([e2]);

    expect(
      filterProviders(
        [e1, e2],
        mockServices.rootConfig({
          data: {
            catalog: {
              providerOptions: {
                provider2: { disabled: true },
              },
            },
          },
        }),
      ),
    ).toEqual([e1]);
  });

  it('rejects invalid config', () => {
    const p1 = { getProviderName: () => 'provider1', connect: jest.fn() };
    const p2 = { getProviderName: () => 'provider2', connect: jest.fn() };
    const e1 = { provider: p1 };
    const e2 = { provider: p2 };

    expect(() =>
      filterProviders(
        [e1, e2],
        mockServices.rootConfig({
          data: {
            catalog: {
              providerOptions: {
                provider1: { disabled: 'i guess so, maybe' },
              },
            },
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unable to convert config value for key 'catalog.providerOptions.provider1.disabled' in 'mock-config' to a boolean"`,
    );
  });
});
