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

import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { Entity, LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { DatabaseManager } from '../database';
import { CatalogProcessorEmit } from '../ingestion';
import * as result from '../ingestion/processors/results';
import { CatalogBuilder, CatalogEnvironment } from './CatalogBuilder';

describe('CatalogBuilder', () => {
  const db = DatabaseManager.createTestDatabaseConnection();
  const reader: jest.Mocked<UrlReader> = { read: jest.fn() };
  const env: CatalogEnvironment = {
    logger: getVoidLogger(),
    database: { getClient: () => db },
    config: ConfigReader.fromConfigs([]),
    reader,
  };

  afterEach(() => jest.resetAllMocks());

  it('works with no changes', async () => {
    const builder = new CatalogBuilder(env);
    const built = await builder.build();
    await expect(built.entitiesCatalog.entities()).resolves.toEqual([]);
    await expect(built.locationsCatalog.locations()).resolves.toEqual([
      expect.objectContaining({
        data: expect.objectContaining({ type: 'bootstrap' }),
      }),
    ]);
  });

  it('works with everything replaced', async () => {
    reader.read.mockResolvedValue(Buffer.from('junk'));

    const builder = new CatalogBuilder(env)
      .replaceEntityPolicies([
        {
          async enforce(entity: Entity) {
            expect(entity.metadata.namespace).toBe('ns');
            return entity;
          },
        },
      ])
      .replaceEntityKinds([
        {
          async enforce(entity: Entity) {
            expect(entity.metadata.namespace).toBe('ns');
            return entity;
          },
        },
      ])
      .setPlaceholderResolver('t', async ({ value }) => {
        expect(value).toBe('tt');
        return 'tt2';
      })
      .setFieldFormatValidators({
        isValidEntityName: n => {
          expect(n).toBe('n');
          return true;
        },
      })
      .replaceProcessors([
        {
          async readLocation(
            location: LocationSpec,
            _optional: boolean,
            emit: CatalogProcessorEmit,
          ) {
            expect(location.type).toBe('test');
            emit(result.data(location, await reader.read('ignored')));
            return true;
          },
          async parseData(
            data: Buffer,
            location: LocationSpec,
            emit: CatalogProcessorEmit,
          ) {
            expect(data.toString()).toEqual('junk');
            emit(
              result.entity(location, {
                apiVersion: 'av',
                kind: 'Component',
                metadata: { name: 'n', replaced: { $t: 'tt' } },
              }),
            );
            return true;
          },
          async preProcessEntity(entity: Entity) {
            expect(entity.apiVersion).toBe('av');
            return {
              ...entity,
              metadata: { ...entity.metadata, namespace: 'ns' },
            };
          },
          async postProcessEntity(entity: Entity) {
            expect(entity.metadata.namespace).toBe('ns');
            return {
              ...entity,
              metadata: { ...entity.metadata, post: 'p' },
            };
          },
        },
      ]);
    const out = await builder.build();

    const added = await out.higherOrderOperation.addLocation({
      type: 'test',
      target: '',
    });
    expect.assertions(8);
    expect(added.entities).toEqual([
      {
        apiVersion: 'av',
        kind: 'Component',
        metadata: {
          name: 'n',
          namespace: 'ns',
          post: 'p',
          replaced: 'tt2',
          uid: expect.any(String),
          etag: expect.any(String),
          generation: expect.any(Number),
        },
        relations: [],
      },
    ]);
  });
});
