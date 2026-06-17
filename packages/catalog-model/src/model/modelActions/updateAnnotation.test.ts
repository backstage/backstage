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

import { opsFromCatalogModelUpdateAnnotation } from './updateAnnotation';

describe('opsFromCatalogModelUpdateAnnotation', () => {
  it('should produce an op for a basic annotation update', () => {
    const ops = opsFromCatalogModelUpdateAnnotation({
      name: 'backstage.io/techdocs-ref',
      title: 'TechDocs Ref',
      description: 'Updated',
    });

    expect(ops).toEqual([
      {
        op: 'updateAnnotation.v1',
        name: 'backstage.io/techdocs-ref',
        properties: {
          title: 'TechDocs Ref',
          description: 'Updated',
        },
      },
    ]);
  });

  it('should produce an op with schema', () => {
    const ops = opsFromCatalogModelUpdateAnnotation({
      name: 'backstage.io/view-url',
      schema: {
        jsonSchema: {
          type: 'string',
          format: 'uri',
        },
      },
    });

    expect(ops).toEqual([
      {
        op: 'updateAnnotation.v1',
        name: 'backstage.io/view-url',
        properties: {
          schema: {
            jsonSchema: {
              type: 'string',
              format: 'uri',
            },
          },
        },
      },
    ]);
  });

  it('should reject a schema with a non-string type', () => {
    expect(() =>
      opsFromCatalogModelUpdateAnnotation({
        name: 'example.com/count',
        schema: {
          jsonSchema: {
            type: 'number',
          },
        },
      }),
    ).toThrow(/only string values are supported/);
  });
});
