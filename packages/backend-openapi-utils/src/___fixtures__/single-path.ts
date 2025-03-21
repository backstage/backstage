/*
 * Copyright 2023 The Backstage Authors
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

export default {
  openapi: '3.0.2',
  info: {
    title: 'Swagger Petstore - OpenAPI 3.0',
    description:
      "This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about\nSwagger at [http://swagger.io](http://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!\nYou can now help us improve the API whether it's by making changes to the definition itself or to the code.\nThat way, with time, we can improve the API in general, and expose some of the new features in OAS3.\n\nSome useful links:\n- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)\n- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)",
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'apiteam@swagger.io',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    version: '1.0.17',
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
  servers: [
    {
      url: '/',
    },
  ],
  paths: {
    '/pet/{petId}': {
      get: {
        summary: 'Find pet by ID',
        description: 'Returns a single pet',
        operationId: 'getPetById',
        parameters: [
          {
            name: 'petId',
            in: 'path',
            description: 'ID of pet to return',
            required: true,
            schema: {
              type: 'integer',
              format: 'int64',
            },
          },
        ],
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pet',
                },
              },
            },
          },
          '400': {
            description: 'Invalid ID supplied',
          },
          '404': {
            description: 'Pet not found',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pet: {
        required: ['name', 'photoUrls'],
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10,
          },
          name: {
            type: 'string',
            example: 'doggie',
          },
          photoUrls: {
            type: 'array',
            xml: {
              wrapped: true,
            },
            items: {
              type: 'string',
              xml: {
                name: 'photoUrl',
              },
            },
          },
          status: {
            type: 'string',
            description: 'pet status in the store',
            enum: ['available', 'pending', 'sold'],
          },
        },
        xml: {
          name: 'pet',
        },
      },
    },
  },
} as const;
