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

import { createUpdateAnnotationOp } from './updateAnnotation';

describe('createUpdateAnnotationOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createUpdateAnnotationOp({
      name: 'backstage.io/techdocs-ref',
      properties: {
        title: 'TechDocs Ref',
        description: 'Updated description',
      },
    });

    expect(result).toEqual({
      op: 'updateAnnotation.v1',
      name: 'backstage.io/techdocs-ref',
      properties: {
        title: 'TechDocs Ref',
        description: 'Updated description',
      },
    });
  });

  it('should accept all-optional properties', () => {
    const result = createUpdateAnnotationOp({
      name: 'backstage.io/techdocs-ref',
      properties: {},
    });

    expect(result.op).toBe('updateAnnotation.v1');
    expect(result.properties).toEqual({});
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createUpdateAnnotationOp({
        name: 'backstage.io/techdocs-ref',
        properties: {},
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should throw on missing required fields', () => {
    expect(() =>
      createUpdateAnnotationOp({
        properties: {},
      } as any),
    ).toThrow(/name/);
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createUpdateAnnotationOp({
        name: 123,
        properties: {},
      } as any),
    ).toThrow(/name/);
  });
});
