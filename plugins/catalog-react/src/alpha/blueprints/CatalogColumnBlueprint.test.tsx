/*
 * Copyright 2026 The Backstage Authors
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

import { createExtensionTester } from '@backstage/frontend-test-utils';
import { CatalogColumnBlueprint } from './CatalogColumnBlueprint';
import {
  catalogColumnCellDataRef,
  catalogColumnHeaderDataRef,
} from './extensionData';

describe('CatalogColumnBlueprint', () => {
  it('exposes the header descriptor and cell renderer', () => {
    const cell = jest.fn(() => <span>cell</span>);
    const ext = CatalogColumnBlueprint.make({
      name: 'demo',
      params: {
        id: 'demo',
        label: 'Demo',
        cell,
        orderField: 'metadata.name',
        searchFields: ['metadata.name'],
      },
    });

    const tester = createExtensionTester(ext);

    expect(tester.get(catalogColumnHeaderDataRef)).toEqual({
      id: 'demo',
      label: 'Demo',
      orderField: 'metadata.name',
      searchFields: ['metadata.name'],
    });

    const cellRenderer = tester.get(catalogColumnCellDataRef);
    expect(typeof cellRenderer).toBe('function');
  });

  it('omits optional fields from the header when not provided', () => {
    const ext = CatalogColumnBlueprint.make({
      name: 'minimal',
      params: {
        id: 'minimal',
        label: 'Minimal',
        cell: () => <span />,
      },
    });

    const tester = createExtensionTester(ext);
    const header = tester.get(catalogColumnHeaderDataRef);
    expect(header).toEqual({ id: 'minimal', label: 'Minimal' });
  });

  it('hides the column when config.visible is false', () => {
    const ext = CatalogColumnBlueprint.make({
      name: 'hidden',
      params: {
        id: 'hidden',
        label: 'Hidden',
        cell: () => <span />,
      },
    });

    const tester = createExtensionTester(ext, { config: { visible: false } });
    expect(tester.get(catalogColumnHeaderDataRef)).toBeUndefined();
    expect(tester.get(catalogColumnCellDataRef)).toBeUndefined();
  });

  it('preserves the per-row filter predicate on the header', () => {
    const filter = (e: { kind: string }) => e.kind === 'Component';
    const ext = CatalogColumnBlueprint.make({
      name: 'filtered',
      params: {
        id: 'filtered',
        label: 'Filtered',
        cell: () => <span />,
        filter,
      },
    });

    const tester = createExtensionTester(ext);
    const header = tester.get(catalogColumnHeaderDataRef);
    expect(header?.filter).toBe(filter);
  });
});
