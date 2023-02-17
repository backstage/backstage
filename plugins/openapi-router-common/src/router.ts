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
import { ErrorRequestHandler, RequestHandler, Router } from 'express';
import core, { ParamsDictionary } from 'express-serve-static-core';
import { FromSchema, JSONSchema7 } from 'json-schema-to-ts';
import {
  DocPathMethod,
  DocPathTemplate,
  MethodAwareDocPath,
  PathTemplate,
  RequestBodySchema,
  RequiredDoc,
  ValueOf,
} from './types';
import { ResponseSchemas } from './types/response';

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

const doc = {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Swagger Petstore',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://petstore.swagger.io/v1',
    },
  ],
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        operationId: 'listPets',
        tags: ['pets'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'How many items to return at one time (max 100)',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
            },
          },
        ],
        responses: {
          '200': {
            description: 'A paged array of pets',
            headers: {
              'x-next': {
                description: 'A link to the next page of responses',
                schema: {
                  type: 'string',
                },
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pets',
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
        summary: 'Create a pet',
        operationId: 'createPets',
        tags: ['pets'],
        responses: {
          '201': {
            description: 'Null response',
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
    '/pets/{petId}': {
      get: {
        summary: 'Info for a specific pet',
        operationId: 'showPetById',
        tags: ['pets'],
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            description: 'The id of the pet to retrieve',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Expected response to a valid request',
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
  },
  components: {
    schemas: {
      Pet: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          tag: {
            type: 'string',
          },
        },
      },
      Pets: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Pet',
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
} as const;

type RemoveTail<
  S extends string,
  Tail extends string,
> = S extends `${infer P}${Tail}` ? P : S;
type GetRouteParameter<S extends string> = RemoveTail<
  RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
  `.${string}`
>;
export type RouteParameters<Route extends string> = string extends Route
  ? ParamsDictionary
  : Route extends `${string}(${string}`
  ? ParamsDictionary
  : Route extends `${string}:${infer Rest}`
  ? (GetRouteParameter<Rest> extends never
      ? ParamsDictionary
      : GetRouteParameter<Rest> extends `${infer ParamName}?`
      ? { [P in ParamName]?: string }
      : { [P in GetRouteParameter<Rest>]: string }) &
      (Rest extends `${GetRouteParameter<Rest>}${infer Next}`
        ? RouteParameters<Next>
        : unknown)
  : {};
interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

// oh boy don't do this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

type ConvertAll<T, R extends ReadonlyArray<unknown> = []> = T extends [
  infer First extends JSONSchema7,
  ...infer Rest,
]
  ? ConvertAll<Rest, [...R, FromSchema<First>]>
  : R;

type ResponseBodyToJsonSchema<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathMethod<Doc, Path>,
> = ConvertAll<
  TuplifyUnion<ValueOf<ResponseSchemas<Doc, Path, Method>>>
>[number];

type RequestBodyToJsonSchema<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathMethod<Doc, Path>,
> = ConvertAll<
  TuplifyUnion<ValueOf<RequestBodySchema<Doc, Path, Method>>>
>[number];
export type RequestHandlerParams<
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  LocalsObj extends Record<string, any>,
> =
  | RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
  | ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>;

type DocRequestHandler<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends keyof Doc['paths'][Path],
> = core.RequestHandler<
  core.ParamsDictionary,
  // From https://stackoverflow.com/questions/71393738/typescript-intersection-not-union-type-from-json-schema.
  ResponseBodyToJsonSchema<Doc, Path, Method>,
  RequestBodyToJsonSchema<Doc, Path, Method>,
  ParsedQs,
  Record<string, string>
>;

export interface ApiRouterMatcher<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends DocPathMethod<Doc, Path>,
  T,
> {
  (
    path: MethodAwareDocPath<Doc, Path, Method>,
    ...handlers: Array<DocRequestHandler<Doc, Path, Method>>
  ): T;
}

export interface ApiRouter<Doc extends RequiredDoc> extends Router {
  get<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'get'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'get'>[]
  ): this;

  post<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'post'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'post'>[]
  ): this;

  all<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'all'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'all'>[]
  ): this;

  put<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'put'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'put'>[]
  ): this;
  delete<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'delete'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'delete'>[]
  ): this;
  patch<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'patch'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'patch'>[]
  ): this;
  options<
    Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'options'>,
  >(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'options'>[]
  ): this;
  head<Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, 'head'>>(
    path: Path,
    ...handlers: DocRequestHandler<Doc, Path, 'head'>[]
  ): this;
}

interface RouterOptions {}

export async function createRouter(options: RouterOptions) {
  console.log(options);
  const router = Router() as ApiRouter<DeepWriteable<typeof doc>>;

  router.get('/pets/:uid', (req, res) => {
    res.json({
      id: 1,
      name: req.params.uid,
    });
  });

  // router.get('/pet') will complain with a TS error

  router.post('/pets', (req, res) => {
    res.send({
      message: req.path,
      code: 1,
    });
  });
  return router;
}
