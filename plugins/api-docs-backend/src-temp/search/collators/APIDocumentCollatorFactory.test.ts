/*
 * Copyright 2022 The Backstage Authors
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

import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';

import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Readable } from 'stream';
import { APIDocumentCollatorFactory } from './APIDocumentCollatorFactory';
import { SpecHandler, SpecParser } from '../spec-parsers';

const server = setupServer();

const expectedEntities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: {
      name: 'test-entity',
      description: 'The expected description',
    },
    spec: {
      type: 'openapi',
      lifecycle: 'production',
      owner: 'someone',
      definition: {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'Swagger Petstore',
          description:
            'A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0 specification',
          termsOfService: 'http://swagger.io/terms/',
          contact: {
            name: 'Swagger API Team',
            email: 'apiteam@swagger.io',
            url: 'http://swagger.io',
          },
          license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
          },
        },
        servers: [
          {
            url: 'http://petstore.swagger.io/api',
          },
        ],
        paths: {
          '/pets': {
            get: {
              description:
                'Returns all pets from the system that the user has access to\nNam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.\nSed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.\n',
              operationId: 'findPets',
              parameters: [
                {
                  name: 'tags',
                  in: 'query',
                  description: 'tags to filter by',
                  required: false,
                  style: 'form',
                  schema: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
                {
                  name: 'limit',
                  in: 'query',
                  description: 'maximum number of results to return',
                  required: false,
                  schema: {
                    type: 'integer',
                    format: 'int32',
                  },
                },
              ],
              responses: {
                '200': {
                  description: 'pet response',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Pet',
                        },
                      },
                    },
                  },
                },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error',
                      },
                    },
                  },
                },
              },
            },
            post: {
              description:
                'Creates a new pet in the store. Duplicates are allowed',
              operationId: 'addPet',
              requestBody: {
                description: 'Pet to add to the store',
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/NewPet',
                    },
                  },
                },
              },
              responses: {
                '200': {
                  description: 'pet response',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Pet',
                      },
                    },
                  },
                },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error',
                      },
                    },
                  },
                },
              },
            },
          },
          '/pets/{id}': {
            get: {
              description:
                'Returns a user based on a single ID, if the user does not have access to the pet',
              operationId: 'find pet by id',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  description: 'ID of pet to fetch',
                  required: true,
                  schema: {
                    type: 'integer',
                    format: 'int64',
                  },
                },
              ],
              responses: {
                '200': {
                  description: 'pet response',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Pet',
                      },
                    },
                  },
                },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error',
                      },
                    },
                  },
                },
              },
            },
            delete: {
              description: 'deletes a single pet based on the ID supplied',
              operationId: 'deletePet',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  description: 'ID of pet to delete',
                  required: true,
                  schema: {
                    type: 'integer',
                    format: 'int64',
                  },
                },
              ],
              responses: {
                '204': {
                  description: 'pet deleted',
                },
                default: {
                  description: 'unexpected error',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Pet: {
              allOf: [
                {
                  $ref: '#/components/schemas/NewPet',
                },
                {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                    },
                  },
                },
              ],
            },
            NewPet: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                },
                tag: {
                  type: 'string',
                },
              },
            },
            Error: {
              type: 'object',
              required: ['code', 'message'],
              properties: {
                code: {
                  type: 'integer',
                  format: 'int32',
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
];

describe('APIDocumentCollatorFactory', () => {
  const config = new ConfigReader({});

  const mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007'),
    getExternalBaseUrl: jest.fn(),
  };
  const mockTokenManager: jest.Mocked<TokenManager> = {
    getToken: jest.fn().mockResolvedValue({ token: '' }),
    authenticate: jest.fn(),
  };

  const mockSpecParser: jest.Mocked<SpecParser> = {
    specType: 'openapi',
    getSpecText: jest.fn().mockReturnValue('indexable definition text'),
  };

  const mockSpecHander: jest.Mocked<SpecHandler> = {
    specParsers: { mockSpecParser },
    addSpecParser: jest.fn(),
    getSpecParser: jest.fn().mockReturnValue(mockSpecParser),
  };

  const options = {
    discovery: mockDiscoveryApi,
    tokenManager: mockTokenManager,
    specHandler: mockSpecHander,
  };

  setupRequestMockHandlers(server);

  beforeEach(() => {
    server.use(
      rest.get('http://localhost:7007/entities', (req, res, ctx) => {
        // Imitate offset/limit pagination.
        const offset = parseInt(req.url.searchParams.get('offset') || '0', 10);
        const limit = parseInt(req.url.searchParams.get('limit') || '500', 10);
        return res(ctx.json(expectedEntities.slice(offset, limit + offset)));
      }),
    );
  });

  it('has expected type', () => {
    const factory = APIDocumentCollatorFactory.fromConfig(config, options);
    expect(factory.type).toBe('api-definition');
  });

  describe('getCollator', () => {
    let factory: APIDocumentCollatorFactory;
    let collator: Readable;

    beforeEach(async () => {
      factory = APIDocumentCollatorFactory.fromConfig(config, options);
      collator = await factory.getCollator();
    });

    it('returns a readable stream', async () => {
      expect(collator).toBeInstanceOf(Readable);
    });

    it('fetches from the configured catalog service', async () => {
      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('catalog');
      expect(documents).toHaveLength(expectedEntities.length);
    });

    it('maps a returned entity to an expected APIDocument', async () => {
      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();

      expect(documents[0]).toMatchObject({
        title: expectedEntities[0].metadata.name,
        location: `/catalog/default/api/${expectedEntities[0].metadata.name}/definition/`,
        text: 'indexable definition text',
        lifecycle: expectedEntities[0]!.spec!.lifecycle,
      });
    });
  });
});
