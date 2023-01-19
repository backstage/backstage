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
import { OpenAPIV3_1 } from 'openapi-types';
import { FieldValues } from './types/fields';
import {
  AppendNonBlankKey,
  FieldPath,
  FieldPathValue,
  Path,
} from './types/path';
import { IRouter, Router, IRouterMatcher } from 'express';
import core, {
  ParamsDictionary,
  RequestHandler,
} from 'express-serve-static-core';
import { FromSchema } from 'json-schema-to-ts';

type RouterFn<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  name: TFieldName,
) => null;

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

const isUndefined = (a: any): a is undefined => a === undefined;
const isNull = (a: any): a is null => a === null;

const isNullOrUndefined = (a: any): a is undefined | null =>
  isUndefined(a) || isNull(a);

const isDateObject = (value: unknown): value is Date => value instanceof Date;

const isObjectType = (value: unknown) => typeof value === 'object';

const isObject = <T extends object>(value: unknown): value is T =>
  !isNullOrUndefined(value) &&
  !Array.isArray(value) &&
  isObjectType(value) &&
  !isDateObject(value);

const compact = <TValue>(value: TValue[]) =>
  Array.isArray(value) ? value.filter(Boolean) : [];

export const resolve = <T>(
  obj: T,
  path: string,
  defaultValue?: unknown,
): any => {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce(
    (result, key) =>
      isNullOrUndefined(result) ? result : result[key as keyof {}],
    obj,
  );
  if (result === undefined || result === obj) {
    return obj[path as keyof T] === undefined
      ? defaultValue
      : obj[path as keyof T];
  }
  return result;
};

/**
 * We want this to input path and have
 * @param name
 * @returns
 */
const x: RouterFn<typeof doc.paths> = name => {
  console.log(resolve(doc, name));
  return null;
};

x('/pets/{petId}');

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
interface ApiRouterMatcher<
  TFieldValues extends FieldValues,
  T,
  Method extends
    | 'all'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'options'
    | 'head',
> {
  <
    TFieldName extends Path<TFieldValues> = Path<TFieldValues>,
    P = RouteParameters<TFieldName>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    Locals extends Record<string, any> = Record<string, any>,
  >(
    // (it's used as the default type parameter for P)
    path: TFieldName,
    // (This generic is meant to be passed explicitly.)
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>
  ): T;
}

type path = ApiRouterMatcher<typeof doc.paths, any, 'get'>;
const test: path = a => {
  console.log(a);
};
test('/pets/{petId}');

export interface IApiRouter<ApiSpec, PathSpec, T> extends IRouter {
  all: ApiRouterMatcher<PathSpec, T, 'all'>;
  get: ApiRouterMatcher<PathSpec, T, 'get'>;
}

export default class ApiRouter<
  ApiSpec,
  PathSpec extends OpenAPIV3_1.Document,
  T,
> implements IApiRouter<ApiSpec, PathSpec, T>
{
  private _router = Router();

  constructor(private spec: OpenAPIV3_1.Document) {}

  static fromSpec<ApiSpec, PathSpec, T>(spec: OpenAPIV3_1.Document) {
    return new ApiRouter<ApiSpec, PathSpec, T>(spec);
  }

  get<
    TFieldValues extends FieldValues = PathSpec,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(
    path: TFieldName,
    ...handlers: core.RequestHandler<
      core.ParamsDictionary,
      any,
      FieldPathValue<FieldPathValue<TFieldValues, TFieldName>, 'get'>,
      ParsedQs,
      Record<string, string>
    >[]
  ) {
    console.log(path);
    return this._router.get(path, ...handlers);
  }
}

const router = ApiRouter.fromSpec<typeof doc, typeof doc.paths, any>(doc);

router.get('/pets', (req, res) => {
  req.body.tags;
});
