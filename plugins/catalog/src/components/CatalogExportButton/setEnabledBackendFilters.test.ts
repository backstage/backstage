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
import { setEnabledBackendFilters } from './setEnabledBackendFilters';

describe('setEnabledBackendFilters', () => {
  it('sets single-value backend filters as search params', () => {
    const filters = {
      myBackend: {
        getCatalogFilters: () => ({ type: 'service' }),
      },
    } as any;

    const params = new URLSearchParams();

    setEnabledBackendFilters(filters, params);

    expect(params.get('type')).toBe('service');
  });

  it('sets array backend filters by appending multiple values', () => {
    const filters = {
      backend: {
        getCatalogFilters: () => ({ kind: ['Component', 'API'] }),
      },
    } as any;

    const params = new URLSearchParams();

    setEnabledBackendFilters(filters, params);

    expect(params.getAll('kind')).toEqual(['Component', 'API']);
  });

  it('ignores non-backend filters and filters returning null/undefined', () => {
    const filters = {
      notBackend: { someProp: true },
      nullBackend: {
        getCatalogFilters: () => undefined,
      },
      backend: {
        getCatalogFilters: () => ({ owner: 'team-a' }),
      },
    } as any;

    const params = new URLSearchParams();

    setEnabledBackendFilters(filters, params);

    expect(params.get('owner')).toBe('team-a');
    expect(params.get('someProp')).toBeNull();
  });

  it('overwrites existing single-value params but appends arrays preserving existing values', () => {
    const filters = {
      backend1: { getCatalogFilters: () => ({ region: 'eu' }) },
      backend2: { getCatalogFilters: () => ({ tags: ['a', 'b'] }) },
    } as any;

    const params = new URLSearchParams('region=us&tags=x');

    setEnabledBackendFilters(filters, params);

    expect(params.get('region')).toBe('eu');
    expect(params.getAll('tags')).toEqual(['x', 'a', 'b']);
  });
});
