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

/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
jest.mock('../util', () => ({
  __esModule: true,
  getEntityDataFromColumns: jest.fn(),
}));

import { getEntityDataFromColumns } from '../util';
import { JsonExporter } from './json';

const getEntityDataMock = getEntityDataFromColumns as unknown as jest.Mock;

describe('JsonExporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes the correct contentType and filename', () => {
    const exporter = new JsonExporter();
    expect(exporter.contentType).toBe('application/json; charset=utf-8');
    expect(exporter.filename).toBe('catalog-export.json');
  });

  it('serializes entities into pretty JSON using getEntityDataFromColumns', async () => {
    const exporter = new JsonExporter();

    const entities = [
      { apiVersion: 'v1', kind: 'Component', metadata: { name: 'one' } } as any,
      { apiVersion: 'v1', kind: 'Component', metadata: { name: 'two' } } as any,
    ];

    const columns = [
      { entityFilterKey: 'name', title: 'Name' },
      { entityFilterKey: 'owner', title: 'Owner' },
    ] as any;

    getEntityDataMock.mockImplementation((entity: any) => ({
      name: entity.metadata?.name,
      owner: `${entity.metadata?.name}-owner`,
    }));

    const result = await exporter.serialize(entities, columns);

    expect(result).toBe(
      JSON.stringify(
        [
          { name: 'one', owner: 'one-owner' },
          { name: 'two', owner: 'two-owner' },
        ],
        null,
        2,
      ),
    );

    expect(getEntityDataMock).toHaveBeenCalledTimes(2);
    expect(getEntityDataMock).toHaveBeenNthCalledWith(1, entities[0], columns);
    expect(getEntityDataMock).toHaveBeenNthCalledWith(2, entities[1], columns);
  });

  it('serializes empty entity list to empty array JSON', async () => {
    const exporter = new JsonExporter();
    const entities: any[] = [];
    const columns = [{ entityFilterKey: 'name', title: 'Name' }] as any;

    const result = await exporter.serialize(entities, columns);

    expect(result).toBe(JSON.stringify([], null, 2));
    expect(getEntityDataMock).not.toHaveBeenCalled();
  });
});
