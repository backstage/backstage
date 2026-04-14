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

import { createUpdateRelationOp } from './updateRelation';

describe('createUpdateRelationOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createUpdateRelationOp({
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
      op: 'updateRelation.v1',
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

  it('should accept all-optional properties', () => {
    const result = createUpdateRelationOp({
      fromKind: 'Component',
      type: 'ownedBy',
      toKind: 'Group',
      properties: {},
    });

    expect(result.op).toBe('updateRelation.v1');
    expect(result.properties).toEqual({});
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createUpdateRelationOp({
        fromKind: 'Component',
        type: 'ownedBy',
        toKind: 'Group',
        properties: {},
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createUpdateRelationOp({
        fromKind: 'Component',
        toKind: 'Group',
        properties: {},
      } as any),
    ).toThrow(/type/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createUpdateRelationOp({
        fromKind: 123,
        type: 'ownedBy',
        toKind: 'Group',
        properties: {},
      } as any),
    ).toThrow(/fromKind/);
  });
});
