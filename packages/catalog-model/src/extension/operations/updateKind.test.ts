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

import { createUpdateKindOp } from './updateKind';

describe('createUpdateKindOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createUpdateKindOp({
      kind: 'Component',
      properties: {
        singular: 'component',
        plural: 'components',
        description: 'A software component',
      },
    });

    expect(result).toEqual({
      op: 'updateKind.v1',
      kind: 'Component',
      properties: {
        singular: 'component',
        plural: 'components',
        description: 'A software component',
      },
    });
  });

  it('should accept all-optional properties', () => {
    const result = createUpdateKindOp({
      kind: 'Component',
      properties: {},
    });

    expect(result.op).toBe('updateKind.v1');
    expect(result.properties).toEqual({});
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createUpdateKindOp({
        kind: 'Component',
        properties: {},
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createUpdateKindOp({
        properties: {},
      } as any),
    ).toThrow(/kind/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createUpdateKindOp({
        kind: 123,
        properties: {},
      } as any),
    ).toThrow(/kind/);
  });
});
