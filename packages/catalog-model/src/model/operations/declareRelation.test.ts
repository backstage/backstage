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

import { createDeclareRelationOp } from './declareRelation';

describe('createDeclareRelationOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createDeclareRelationOp({
      fromKind: 'Component',
      type: 'ownedBy',
      toKind: 'Group',
      properties: {
        reverseType: 'ownerOf',
        title: 'owned by',
        description: 'The owner of the component',
      },
    });

    expect(result).toEqual({
      op: 'declareRelation.v1',
      fromKind: 'Component',
      type: 'ownedBy',
      toKind: 'Group',
      properties: {
        reverseType: 'ownerOf',
        title: 'owned by',
        description: 'The owner of the component',
      },
    });
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createDeclareRelationOp({
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
          singular: 'owner',
          plural: 'owners',
          description: 'The owner',
        },
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createDeclareRelationOp({
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
        },
      } as any),
    ).toThrow(/title/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createDeclareRelationOp({
        fromKind: 123,
        type: 'ownedBy',
        toKind: 'Group',
        properties: {
          reverseType: 'ownerOf',
          singular: 'owner',
          plural: 'owners',
          description: 'The owner',
        },
      } as any),
    ).toThrow(/fromKind/);
  });
});
