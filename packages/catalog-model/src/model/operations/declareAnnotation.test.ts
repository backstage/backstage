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

import { createDeclareAnnotationOp } from './declareAnnotation';

describe('createDeclareAnnotationOp', () => {
  it('should create a valid op with the op field filled in', () => {
    const result = createDeclareAnnotationOp({
      name: 'backstage.io/techdocs-ref',
      properties: {
        description: 'A reference to the TechDocs source',
        schema: { jsonSchema: { type: 'string' } },
      },
    });

    expect(result).toEqual({
      op: 'declareAnnotation.v1',
      name: 'backstage.io/techdocs-ref',
      properties: {
        description: 'A reference to the TechDocs source',
        schema: { jsonSchema: { type: 'string' } },
      },
    });
  });

  it('should reject unknown fields', () => {
    expect(() =>
      createDeclareAnnotationOp({
        name: 'backstage.io/techdocs-ref',
        properties: {
          description: 'A reference to the TechDocs source',
          schema: { jsonSchema: { type: 'string' } },
        },
        extra: 'should be rejected',
      } as any),
    ).toThrow(/extra/);
  });

  it('should accept missing optional schema field', () => {
    const result = createDeclareAnnotationOp({
      name: 'backstage.io/techdocs-ref',
      properties: {
        description: 'A reference to the TechDocs source',
      },
    });

    expect(result).toEqual({
      op: 'declareAnnotation.v1',
      name: 'backstage.io/techdocs-ref',
      properties: {
        description: 'A reference to the TechDocs source',
      },
    });
  });

  it('should throw on wrong field types', () => {
    expect(() =>
      createDeclareAnnotationOp({
        name: 123,
        properties: {
          description: 'A reference to the TechDocs source',
          schema: { jsonSchema: { type: 'string' } },
        },
      } as any),
    ).toThrow(/name/);
  });
});
