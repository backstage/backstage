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

import { opsFromCatalogModelRelationPair } from './addRelationPair';

describe('opsFromCatalogModelRelationPair', () => {
  it('should produce ops for a single fromKind/toKind', () => {
    const ops = opsFromCatalogModelRelationPair({
      fromKind: 'Component',
      toKind: 'Group',
      description: 'Ownership',
      forward: { type: 'ownedBy', title: 'owned by' },
      reverse: { type: 'ownerOf', title: 'owner of' },
    });

    expect(ops).toEqual([
      {
        op: 'declareRelation.v1',
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
          title: 'owned by',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'Group',
        type: 'ownerOf',
        toKind: 'Component',
        properties: {
          reverseType: 'ownedBy',
          title: 'owner of',
          description: 'Ownership',
        },
      },
    ]);
  });

  it('should produce ops for array fromKind/toKind', () => {
    const ops = opsFromCatalogModelRelationPair({
      fromKind: ['Component', 'Resource'],
      toKind: ['Group', 'User'],
      description: 'Ownership',
      forward: { type: 'ownedBy', title: 'owned by' },
      reverse: { type: 'ownerOf', title: 'owner of' },
    });

    expect(ops).toHaveLength(8);
    expect(ops).toEqual([
      {
        op: 'declareRelation.v1',
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
          title: 'owned by',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'Group',
        type: 'ownerOf',
        toKind: 'Component',
        properties: {
          reverseType: 'ownedBy',
          title: 'owner of',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'User',
        properties: {
          reverseType: 'ownerOf',
          title: 'owned by',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'User',
        type: 'ownerOf',
        toKind: 'Component',
        properties: {
          reverseType: 'ownedBy',
          title: 'owner of',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'Resource',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
          title: 'owned by',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'Group',
        type: 'ownerOf',
        toKind: 'Resource',
        properties: {
          reverseType: 'ownedBy',
          title: 'owner of',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'Resource',
        type: 'ownedBy',
        toKind: 'User',
        properties: {
          reverseType: 'ownerOf',
          title: 'owned by',
          description: 'Ownership',
        },
      },
      {
        op: 'declareRelation.v1',
        fromKind: 'User',
        type: 'ownerOf',
        toKind: 'Resource',
        properties: {
          reverseType: 'ownedBy',
          title: 'owner of',
          description: 'Ownership',
        },
      },
    ]);
  });
});
