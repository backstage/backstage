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
import { bundleFileWithRefs, BundlerRead, BundlerResolveUrl } from './bundle';
import { mockServices } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';

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

describe('bundleFileWithRefs', () => {
  const read = jest.fn();
  const resolveUrl = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the bundled specification', async () => {
    read.mockResolvedValue(list);

    const result = await bundleFileWithRefs(
      specification,
      'https://github.com/owner/repo/blob/main/catalog-info.yaml',
      read,
      resolveUrl,
    );

    expect(result).toEqual(expectedResult.trimStart());
  });
  it('should use the urlreaders to fetch $refs', async () => {
    const spec = `
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
          $ref: "https://foo.com/paths/pets/list.yaml"
    `;

    read.mockResolvedValue(list);

    const result = await bundleFileWithRefs(
      spec,
      'https://github.com/owner/repo/blob/main/catalog-info.yaml',
      read,
      resolveUrl,
    );

    expect(result).toEqual(expectedResult.trimStart());
  });
  it('should return the bundled asyncapi specification', async () => {
    const spec = `
      asyncapi: 2.5.0
      info:
        version: 1.0.0
        title: Sample API
        description: A sample API to illustrate OpenAPI concepts
      channels:
        my-topic:
          subscribe:
            message: 
              schemaFormat: "application/schema+json;version=draft-07"
              payload: 
                $ref : "./asyncapi.schema.json"
    `;
    const jsonSchema = `
      {
        "type": "object",
        "description": "ExampleSchema",
        "properties": {
          "name" : {
            "type": "string"
          },
          "age" : {
            "type" : "integer"
          }
        }
      }
    `;
    const expectedSchema = `
asyncapi: 2.5.0
info:
  version: 1.0.0
  title: Sample API
  description: A sample API to illustrate OpenAPI concepts
channels:
  my-topic:
    subscribe:
      message:
        schemaFormat: application/schema+json;version=draft-07
        payload:
          type: object
          description: ExampleSchema
          properties:
            name:
              type: string
            age:
              type: integer
`;
    read.mockResolvedValue(jsonSchema);

    const result = await bundleFileWithRefs(
      spec,
      'https://github.com/owner/repo/blob/main/catalog-info.yaml',
      read,
      resolveUrl,
    );

    expect(result).toEqual(expectedSchema.trimStart());
  });
});

describe('bundleFileWithRefs - Testing getRelativePath scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const scmIntegrations = ScmIntegrations.fromConfig(mockServices.rootConfig());

  const resolveUrl: BundlerResolveUrl = jest.fn(
    (url: string, base: string): string => {
      return scmIntegrations.resolveUrl({ url, base });
    },
  );

  const read: BundlerRead = jest.fn(async (url: string) => {
    return Buffer.from(url);
  });

  const baseUrl =
    'https://dev.azure.com/organization/project/_git/idp-configurations?path=%2Frepo%2Ftest-openapi.yaml&version=GBmaster';

  it('should handle the relative path when refUrl has the same base as baseUrl', async () => {
    const fileWithRefs = `
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
      $ref: "common.yaml"
`;

    const relativePath = 'common.yaml';
    const expectedUrl =
      'https://dev.azure.com/organization/project/_git/idp-configurations?path=%2Frepo%2Fcommon.yaml&version=GBmaster';

    await bundleFileWithRefs(fileWithRefs, baseUrl, read, resolveUrl);

    expect(resolveUrl).toHaveBeenCalledWith(relativePath, baseUrl);
    expect(read).toHaveBeenCalledWith(expectedUrl);
  });

  it('should handle the relative path, with subdir, when refUrl has the same base as baseUrl', async () => {
    const fileWithRefs = `
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
      $ref: "commons/common.yaml"
`;

    const relativePath = 'commons/common.yaml';
    const expectedUrl =
      'https://dev.azure.com/organization/project/_git/idp-configurations?path=%2Frepo%2Fcommons%2Fcommon.yaml&version=GBmaster';

    await bundleFileWithRefs(fileWithRefs, baseUrl, read, resolveUrl);

    expect(resolveUrl).toHaveBeenCalledWith(relativePath, baseUrl);
    expect(read).toHaveBeenCalledWith(expectedUrl);
  });

  it('should handle the entire refUrl when there is no common base', async () => {
    const fileWithRef = `
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
      $ref: "https://example.com/commons/common.yaml"
`;

    const refUrl = 'https://example.com/commons/common.yaml';

    await bundleFileWithRefs(fileWithRef, baseUrl, read, resolveUrl);

    expect(resolveUrl).toHaveBeenCalledWith(refUrl, baseUrl);
    expect(read).toHaveBeenCalledWith(refUrl);
  });

  it('should handle the relative path when refUrl has a different subdir', async () => {
    const fileWithRefs = `
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
      $ref: "../commons/common.yaml"
`;

    const exampleBaseUrl =
      'https://example.com/path/to/definition/test-openapi.yaml.yaml';
    const relativePath = '../commons/common.yaml';
    const expectedUrl = 'https://example.com/path/to/commons/common.yaml';

    await bundleFileWithRefs(fileWithRefs, exampleBaseUrl, read, resolveUrl);

    expect(resolveUrl).toHaveBeenCalledWith(relativePath, exampleBaseUrl);
    expect(read).toHaveBeenCalledWith(expectedUrl);
  });

  it('should handle the relative path when refUrl has a different subdir (azure)', async () => {
    const fileWithRefs = `
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
      $ref: "../commons/common.yaml"
`;

    const relativePath = '../commons/common.yaml';
    const expectedUrl =
      'https://dev.azure.com/organization/project/_git/idp-configurations?path=%2Fcommons%2Fcommon.yaml&version=GBmaster';

    await bundleFileWithRefs(fileWithRefs, baseUrl, read, resolveUrl);

    expect(resolveUrl).toHaveBeenCalledWith(relativePath, baseUrl);
    expect(read).toHaveBeenCalledWith(expectedUrl);
  });
});
