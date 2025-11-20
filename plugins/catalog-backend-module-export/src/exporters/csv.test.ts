// typescript
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

jest.mock('csv-stringify/lib/sync', () => jest.fn());
jest.mock('../util', () => ({ getEntityDataFromColumns: jest.fn() }));

import stringifySync from 'csv-stringify/lib/sync';
import { getEntityDataFromColumns } from '../util';
import { CsvExporter } from './csv';

const stringifyMock = stringifySync as unknown as jest.Mock;
const getEntityDataMock = getEntityDataFromColumns as unknown as jest.Mock;

describe('CsvExporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes the correct contentType and filename', () => {
    const exporter = new CsvExporter();
    expect(exporter.contentType).toBe('text/csv; charset=utf-8');
    expect(exporter.filename).toBe('catalog-export.csv');
  });

  it('serializes entities into CSV using getEntityDataFromColumns and csv-stringify', async () => {
    const exporter = new CsvExporter();

    const entities = [
      { apiVersion: 'v1', kind: 'Component', metadata: { name: 'one' } } as any,
      { apiVersion: 'v1', kind: 'Component', metadata: { name: 'two' } } as any,
    ];

    const columns = [
      { entityFilterKey: 'name', title: 'Name' },
      { entityFilterKey: 'owner', title: 'Owner' },
    ] as any;

    // Mock getEntityDataFromColumns to return deterministic rows based on entity
    getEntityDataMock.mockImplementation((entity: any, cols: any) => {
      return {
        name: entity.metadata?.name,
        owner: `${entity.metadata?.name}-owner`,
      };
    });

    // Mock stringify to return a predictable CSV string
    const csvString = 'name,owner\none,one-owner\ntwo,two-owner\n';
    stringifyMock.mockReturnValue(csvString);

    const result = await exporter.serialize(entities, columns);

    expect(result).toBe(csvString);

    // getEntityDataFromColumns should be called for each entity with the provided columns
    expect(getEntityDataMock).toHaveBeenCalledTimes(2);
    expect(getEntityDataMock).toHaveBeenNthCalledWith(1, entities[0], columns);
    expect(getEntityDataMock).toHaveBeenNthCalledWith(2, entities[1], columns);

    // stringify should be called once with the rows returned by getEntityDataFromColumns
    expect(stringifyMock).toHaveBeenCalledTimes(1);
    const [passedRows, passedOptions] = stringifyMock.mock.calls[0];
    expect(passedRows).toEqual([
      { name: 'one', owner: 'one-owner' },
      { name: 'two', owner: 'two-owner' },
    ]);
    expect(passedOptions.columns).toEqual(
      columns.map((c: any) => ({
        key: c.title,
        header: c.title,
      })),
    );
  });

  it('calls csv-stringify with empty rows when no entities provided', async () => {
    const exporter = new CsvExporter();

    const entities: any[] = [];
    const columns = [
      { entityFilterKey: 'name', title: 'Name' },
      { entityFilterKey: 'owner', title: 'Owner' },
    ] as any;

    // When there are no entities, csv-stringify still receives an empty rows array
    stringifyMock.mockReturnValue('name,owner\n');

    const result = await exporter.serialize(entities, columns);

    expect(result).toBe('name,owner\n');

    // getEntityDataFromColumns should not have been called
    expect(getEntityDataMock).not.toHaveBeenCalled();

    // stringify should be called with empty rows and the correct options
    expect(stringifyMock).toHaveBeenCalledTimes(1);
    const [passedRows, passedOptions] = stringifyMock.mock.calls[0];
    expect(passedRows).toEqual([]);
    expect(passedOptions.columns).toEqual(
      columns.map((c: any) => ({
        key: c.title,
        header: c.title,
      })),
    );
  });

  it('preserves column titles with commas and quotes in options', async () => {
    const exporter = new CsvExporter();

    const entities: any[] = [];
    const columns = [
      { entityFilterKey: 'a', title: 'A, comma' },
      { entityFilterKey: 'b', title: 'B "quoted"' },
    ] as any;

    stringifyMock.mockReturnValue('A, B\n');

    const result = await exporter.serialize(entities, columns);
    expect(result).toBe('A, B\n');

    expect(stringifyMock).toHaveBeenCalledTimes(1);
    const [, passedOptions] = stringifyMock.mock.calls[0];
    expect(passedOptions.columns).toEqual(
      columns.map((c: any) => ({
        key: c.title,
        header: c.title,
      })),
    );
  });
});
