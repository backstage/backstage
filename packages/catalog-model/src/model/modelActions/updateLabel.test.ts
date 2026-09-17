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

import { opsFromCatalogModelUpdateLabel } from './updateLabel';

describe('opsFromCatalogModelUpdateLabel', () => {
  it('should produce an op for a basic label update', () => {
    const ops = opsFromCatalogModelUpdateLabel({
      name: 'backstage.io/environment',
      title: 'Environment',
    });

    expect(ops).toEqual([
      {
        op: 'updateLabel.v1',
        name: 'backstage.io/environment',
        properties: {
          title: 'Environment',
        },
      },
    ]);
  });

  it('should reject a schema with a non-string type', () => {
    expect(() =>
      opsFromCatalogModelUpdateLabel({
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
