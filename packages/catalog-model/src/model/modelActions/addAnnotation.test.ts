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

import { opsFromCatalogModelAnnotation } from './addAnnotation';

describe('opsFromCatalogModelAnnotation', () => {
  it('should produce an op for a simple annotation', () => {
    const ops = opsFromCatalogModelAnnotation({
      name: 'backstage.io/techdocs-ref',
      description: 'A reference to the TechDocs source for this entity.',
    });

    expect(ops).toEqual([
      {
        op: 'declareAnnotation.v1',
        name: 'backstage.io/techdocs-ref',
        properties: {
          description: 'A reference to the TechDocs source for this entity.',
        },
      },
    ]);
  });

  it('should produce an op with title and schema', () => {
    const ops = opsFromCatalogModelAnnotation({
      name: 'backstage.io/view-url',
      title: 'View URL',
      description: 'A URL to view the entity in an external system.',
      schema: {
        jsonSchema: {
          type: 'string',
          format: 'uri',
        },
      },
    });

    expect(ops).toEqual([
      {
        op: 'declareAnnotation.v1',
        name: 'backstage.io/view-url',
        properties: {
          title: 'View URL',
          description: 'A URL to view the entity in an external system.',
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
      opsFromCatalogModelAnnotation({
        name: 'example.com/count',
        description: 'A count.',
        schema: {
          jsonSchema: {
            type: 'number',
          },
        },
      }),
    ).toThrow(/only string values are supported/);
  });
});
