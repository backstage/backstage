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

import { createDeclareLabelOp } from './declareLabel';

describe('createDeclareLabelOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createDeclareLabelOp({
      name: 'backstage.io/source-location',
      properties: {
        description: 'The source location of the entity',
        schema: { jsonSchema: { type: 'string' } },
      },
    });

    expect(result).toEqual({
      op: 'declareLabel.v1',
      name: 'backstage.io/source-location',
      properties: {
        description: 'The source location of the entity',
        schema: { jsonSchema: { type: 'string' } },
      },
    });
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createDeclareLabelOp({
        name: 'backstage.io/source-location',
        properties: {
          description: 'The source location of the entity',
          schema: { jsonSchema: { type: 'string' } },
        },
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should accept missing optional schema field', () => {
    const result = createDeclareLabelOp({
      name: 'backstage.io/source-location',
      properties: {
        description: 'The source location of the entity',
      },
    });

    expect(result).toEqual({
      op: 'declareLabel.v1',
      name: 'backstage.io/source-location',
      properties: {
        description: 'The source location of the entity',
      },
    });
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createDeclareLabelOp({
        name: 123,
        properties: {
          description: 'The source location of the entity',
          schema: { jsonSchema: { type: 'string' } },
        },
      } as any),
    ).toThrow(/name/);
  });
});
