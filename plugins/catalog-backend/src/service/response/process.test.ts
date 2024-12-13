/*
 * Copyright 2024 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import {
  entitiesResponseToObjects,
  processEntitiesResponseItems,
  processRawEntitiesResult,
} from './process';

const mockTransform = (entity: Entity): Entity => ({
  ...entity,
  kind: `transformed-${entity.kind}`,
});

describe('processRawEntitiesResult', () => {
  it('should prefer keeping results in raw form', () => {
    expect(processRawEntitiesResult(['{"kind":"test"}', null])).toEqual({
      type: 'raw',
      entities: ['{"kind":"test"}', null],
    });

    expect(
      processRawEntitiesResult(['{"kind":"test"}', null], mockTransform),
    ).toEqual({
      type: 'object',
      entities: [{ kind: 'transformed-test' }, null],
    });
  });
});

describe('processEntitiesResponseItems', () => {
  it('should transform entities in object form', () => {
    expect(
      processEntitiesResponseItems({
        type: 'object',
        entities: [{ kind: 'test' } as Entity, null],
      }),
    ).toEqual({
      type: 'object',
      entities: [{ kind: 'test' }, null],
    });

    expect(
      processEntitiesResponseItems(
        {
          type: 'object',
          entities: [{ kind: 'test' } as Entity, null],
        },
        mockTransform,
      ),
    ).toEqual({
      type: 'object',
      entities: [{ kind: 'transformed-test' }, null],
    });
  });

  it('should transform entities in raw form', () => {
    expect(
      processEntitiesResponseItems({
        type: 'raw',
        entities: ['{"kind":"test"}', null],
      }),
    ).toEqual({
      type: 'raw',
      entities: ['{"kind":"test"}', null],
    });

    expect(
      processEntitiesResponseItems(
        {
          type: 'raw',
          entities: ['{"kind":"test"}', null],
        },
        mockTransform,
      ),
    ).toEqual({
      type: 'object',
      entities: [{ kind: 'transformed-test' }, null],
    });
  });
});

describe('entitiesResponseToObjects', () => {
  it('should convert entities in object form', () => {
    expect(
      entitiesResponseToObjects({
        type: 'object',
        entities: [null, { kind: 'test' } as Entity],
      }),
    ).toEqual([null, { kind: 'test' }]);
  });

  it('should convert entities in raw form', () => {
    expect(
      entitiesResponseToObjects({
        type: 'raw',
        entities: [null, '{"kind":"test"}'],
      }),
    ).toEqual([null, { kind: 'test' }]);
  });
});
