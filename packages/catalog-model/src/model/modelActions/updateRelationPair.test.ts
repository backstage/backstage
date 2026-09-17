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

import { opsFromCatalogModelUpdateRelationPair } from './updateRelationPair';

describe('opsFromCatalogModelUpdateRelationPair', () => {
  it('should produce ops for forward and reverse with a reverse type', () => {
    const ops = opsFromCatalogModelUpdateRelationPair({
      fromKind: 'Component',
      toKind: 'Group',
      forward: { type: 'ownedBy', title: 'owned by' },
      reverse: { type: 'ownerOf', title: 'owner of' },
    });

    expect(ops).toEqual([
      {
        op: 'updateRelation.v1',
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
          title: 'owned by',
        },
      },
      {
        op: 'updateRelation.v1',
        fromKind: 'Group',
        type: 'ownerOf',
        toKind: 'Component',
        properties: {
          reverseType: 'ownedBy',
          title: 'owner of',
        },
      },
    ]);
  });

  it('should produce only the forward op when reverse type is not set', () => {
    const ops = opsFromCatalogModelUpdateRelationPair({
      fromKind: 'Component',
      toKind: 'Group',
      forward: { type: 'ownedBy' },
      reverse: {},
    });

    expect(ops).toEqual([
      {
        op: 'updateRelation.v1',
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {},
      },
    ]);
  });
});
