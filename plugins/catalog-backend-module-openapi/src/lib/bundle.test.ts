/*
 * Copyright 2020 The Backstage Authors
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
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { bundleOpenApiSpecification } from './bundle';

const specification = `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Swagger Petstore
  license:
    name: MIT
servers:
  - url: http://petstore.swagger.io/v1
paths:
  /pets:
    get:
      $ref: "./paths/pets/list.yaml"
`;

const list = `
---
summary: List all pets
operationId: listPets
tags:
  - pets
responses:
  '200':
    description: A paged array of pets
    content:
      application/json:    
        schema:
          type: string
`;

const expectedResult = `
openapi: 3.0.0
info:
  version: 1.0.0
  title: Swagger Petstore
  license:
    name: MIT
servers:
  - url: http://petstore.swagger.io/v1
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      tags:
        - pets
      responses:
        "200":
          description: A paged array of pets
          content:
            application/json:
              schema:
                type: string
`;

describe('bundleOpenApiSpecification', () => {
  const readUrl = jest.fn();
  const reader = {
    readUrl,
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const scmIntegration = ScmIntegrations.fromConfig(new ConfigReader({})).byUrl(
    'https://github.com/owner/repo/blob/main/openapi.yaml',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if no specification is supplied', async () => {
    expect(
      await bundleOpenApiSpecification(
        undefined,
        'https://github.com/owner/repo/blob/main/openapi.yaml',
        reader,
        scmIntegration as any,
      ),
    ).toBeUndefined();
  });

  it('should return the bundled specification', async () => {
    readUrl.mockResolvedValue({
      buffer: jest.fn().mockResolvedValue(list),
    });

    const result = await bundleOpenApiSpecification(
      specification,
      'https://github.com/owner/repo/blob/main/openapi.yaml',
      reader,
      scmIntegration as any,
    );

    expect(result).toEqual(expectedResult.trimStart());
  });
});
