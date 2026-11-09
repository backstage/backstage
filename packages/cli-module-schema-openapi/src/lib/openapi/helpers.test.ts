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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { loadAndValidateOpenApiYaml } from './helpers';

describe('loadAndValidateOpenApiYaml', () => {
  const mockDir = createMockDirectory();

  it('resolves YAML merge keys before validating an OpenAPI schema', async () => {
    mockDir.setContent({
      'openapi.yaml': `openapi: 3.0.0
info: { title: Example, version: 1.0.0 }
paths: {}
components:
  schemas:
    Base: &base
      type: object
      properties:
        name: { type: string }
    Extended:
      <<: *base
      description: Extended
`,
    });

    await expect(
      loadAndValidateOpenApiYaml(mockDir.resolve('openapi.yaml')),
    ).resolves.toMatchObject({
      components: {
        schemas: {
          Extended: {
            type: 'object',
            properties: { name: { type: 'string' } },
            description: 'Extended',
          },
        },
      },
    });
  });
});
