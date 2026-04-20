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

import { opsFromCatalogModelTag } from './addTag';

describe('opsFromCatalogModelTag', () => {
  it('should produce an op for a simple tag', () => {
    const ops = opsFromCatalogModelTag({
      name: 'java',
      description: 'Indicates that the entity is related to Java.',
    });

    expect(ops).toEqual([
      {
        op: 'declareTag.v1',
        name: 'java',
        properties: {
          description: 'Indicates that the entity is related to Java.',
        },
      },
    ]);
  });

  it('should produce an op with a title', () => {
    const ops = opsFromCatalogModelTag({
      name: 'production-ready',
      title: 'Production Ready',
      description: 'Indicates that the entity is ready for production use.',
    });

    expect(ops).toEqual([
      {
        op: 'declareTag.v1',
        name: 'production-ready',
        properties: {
          title: 'Production Ready',
          description: 'Indicates that the entity is ready for production use.',
        },
      },
    ]);
  });
});
