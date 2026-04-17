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

import { opsFromCatalogModelLabel } from './addLabel';

describe('opsFromCatalogModelLabel', () => {
  it('should produce an op for a simple label', () => {
    const ops = opsFromCatalogModelLabel({
      name: 'backstage.io/source-location',
      description: 'The source location of the entity.',
    });

    expect(ops).toEqual([
      {
        op: 'declareLabel.v1',
        name: 'backstage.io/source-location',
        properties: {
          description: 'The source location of the entity.',
        },
      },
    ]);
  });

  it('should produce an op with title and schema', () => {
    const ops = opsFromCatalogModelLabel({
      name: 'backstage.io/environment',
      title: 'Environment',
      description: 'The deployment environment of the entity.',
      schema: {
        jsonSchema: {
          type: 'string',
          enum: ['production', 'staging', 'development'],
        },
      },
    });

    expect(ops).toEqual([
      {
        op: 'declareLabel.v1',
        name: 'backstage.io/environment',
        properties: {
          title: 'Environment',
          description: 'The deployment environment of the entity.',
          schema: {
            jsonSchema: {
              type: 'string',
              enum: ['production', 'staging', 'development'],
            },
          },
        },
      },
    ]);
  });

  it('should reject a schema with a non-string type', () => {
    expect(() =>
      opsFromCatalogModelLabel({
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
