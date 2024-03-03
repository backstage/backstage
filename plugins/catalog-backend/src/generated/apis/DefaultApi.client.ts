/*
 * Copyright 2024 The Backstage Authors
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

import type core from 'express-serve-static-core';

import type {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
  CreateLocation201Response,
  CreateLocationRequest,
  EntitiesBatchResponse,
  EntitiesQueryResponse,
  Entity,
  EntityAncestryResponse,
  EntityFacetsResponse,
  GetEntitiesByRefsRequest,
  GetLocations200ResponseInner,
  Location,
  RefreshEntityRequest,
  ValidateEntityRequest,
} from '@backstage/catalog-client';
import { Router } from 'express';

/**
 * no description
 */

type InputOutput = {
  '#POST|/analyze-location': {
    path: {};
    query: {};
    body: AnalyzeLocationRequest;
    response: AnalyzeLocationResponse;
  };

  '#POST|/locations': {
    path: {};
    query: {
      dryRun?: string;
    };
    body: CreateLocationRequest;
    response: CreateLocation201Response;
  };

  '#DELETE|/entities/by-uid/{uid}': {
    path: {
      uid: string;
    };
    query: {};
    response: void;
  };

  '#DELETE|/locations/{id}': {
    path: {
      id: string;
    };
    query: {};
    response: void;
  };

  '#GET|/entities': {
    path: {};
    query: {
      fields?: Array<string>;
      limit?: number;
      filter?: Array<string>;
      offset?: number;
      after?: string;
      order?: Array<string>;
    };
    response: Array<Entity>;
  };

  '#GET|/entities/by-query': {
    path: {};
    query: {
      fields?: Array<string>;
      limit?: number;
      orderField?: Array<string>;
      cursor?: string;
      filter?: Array<string>;
      fullTextFilterTerm?: string;
      fullTextFilterFields?: Array<string>;
    };
    response: EntitiesQueryResponse;
  };

  '#POST|/entities/by-refs': {
    path: {};
    query: {};
    body: GetEntitiesByRefsRequest;
    response: EntitiesBatchResponse;
  };

  '#GET|/entities/by-name/{kind}/{namespace}/{name}/ancestry': {
    path: {
      kind: string;
      namespace: string;
      name: string;
    };
    query: {};
    response: EntityAncestryResponse;
  };

  '#GET|/entities/by-name/{kind}/{namespace}/{name}': {
    path: {
      kind: string;
      namespace: string;
      name: string;
    };
    query: {};
    response: Entity;
  };

  '#GET|/entities/by-uid/{uid}': {
    path: {
      uid: string;
    };
    query: {};
    response: Entity;
  };

  '#GET|/entity-facets': {
    path: {};
    query: {
      facet: Array<string>;
      filter?: Array<string>;
    };
    response: EntityFacetsResponse;
  };

  '#GET|/locations/{id}': {
    path: {
      id: string;
    };
    query: {};
    response: Location;
  };

  '/locations': {
    get: {
      path: {};
      query: {};
      response: Array<GetLocations200ResponseInner>;
    };
  };

  '#POST|/refresh': {
    path: {};
    query: {};
    body: RefreshEntityRequest;
    response: void;
  };

  '#POST|/validate-entity': {
    path: {};
    query: {};
    body: ValidateEntityRequest;
    response: void;
  };
};

type PathTemplate<Path extends string> =
  Path extends `${infer Prefix}{${infer PathName}}${infer Suffix}`
    ? `${Prefix}:${PathName}${PathTemplate<Suffix>}`
    : Path;

type HttpMethods = Uppercase<'all' | 'put' | 'get' | 'post' | 'delete'>;

type ValueOf<T> = T[keyof T];

/**
 * @public
 */
export type Filter<T, U> = T extends U ? T : never;

type DocPath<Doc extends InputOutput> = ValueOf<{
  [Template in keyof Doc]: Template extends `#${string}|${infer Path}`
    ? Path
    : never;
}>;

type DocPathMethod<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
> = ValueOf<{
  [Template in keyof Doc]: Template extends `#${infer Method}|${Path}`
    ? Method extends string
      ? Method
      : never
    : never;
}>;

type PathSchema<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = `#${Method}|${Path}` extends keyof Doc
  ? 'path' extends keyof Doc[`#${Method}|${Path}`]
    ? Doc[`#${Method}|${Path}`]['path']
    : never
  : never;
type RequestBody<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = `#${Method}|${Path}` extends keyof Doc
  ? 'body' extends keyof Doc[`#${Method}|${Path}`]
    ? Doc[`#${Method}|${Path}`]['body']
    : any
  : any;
type ResponseBody<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = `#${Method}|${Path}` extends keyof Doc
  ? 'response' extends keyof Doc[`#${Method}|${Path}`]
    ? Doc[`#${Method}|${Path}`]['response']
    : any
  : any;
type QuerySchema<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = `#${Method}|${Path}` extends keyof Doc
  ? 'query' extends keyof Doc[`#${Method}|${Path}`]
    ? Doc[`#${Method}|${Path}`]['query']
    : never
  : never;

/**
 * Typed express request handler.
 * @public
 */
export type DocRequestHandler<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = core.RequestHandler<
  PathSchema<Doc, Path, Method>,
  ResponseBody<Doc, Path, Method>,
  RequestBody<Doc, Path, Method>,
  QuerySchema<Doc, Path, Method>,
  Record<string, string>
>;

/**
 * Typed express error handler / request handler union type.
 * @public
 */
export type DocRequestHandlerParams<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = core.RequestHandlerParams<
  PathSchema<Doc, Path, Method>,
  ResponseBody<Doc, Path, Method>,
  RequestBody<Doc, Path, Method>,
  QuerySchema<Doc, Path, Method>,
  Record<string, string>
>;

/**
 * @public
 */
export type MethodAwareDocPath<
  Doc extends InputOutput,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ValueOf<{
  [Template in keyof Doc]: Template extends `#${Method}|${Path}` ? Path : never;
}>;

/**
 * Superset of the express router path matcher that enforces typed request and response bodies.
 * @public
 */
export interface DocRequestMatcher<
  Doc extends InputOutput,
  T,
  Method extends HttpMethods,
> {
  <
    TPath extends MethodAwareDocPath<Doc, DocPath<Doc>, Method>,
    TMethod extends DocPathMethod<Doc, TPath>,
  >(
    path: PathTemplate<TPath>,
    ...handlers: Array<DocRequestHandler<Doc, TPath, Method>>
  ): T;
  <TPath extends MethodAwareDocPath<Doc, DocPath<Doc>, Method>>(
    path: PathTemplate<TPath>,
    ...handlers: Array<DocRequestHandlerParams<Doc, TPath, Method>>
  ): T;
}

export interface TypedRouter extends Router {
  get: DocRequestMatcher<InputOutput, this, 'GET'>;
  post: DocRequestMatcher<InputOutput, this, 'POST'>;
  put: DocRequestMatcher<InputOutput, this, 'PUT'>;
  delete: DocRequestMatcher<InputOutput, this, 'DELETE'>;
}

type method = DocRequestMatcher<InputOutput, Router, 'POST'>;

type test2 = keyof method;

type paths = PathTemplate<DocPath<InputOutput>>;
type test3 = PathSchema<
  InputOutput,
  '/entities/by-name/{kind}/{namespace}/{name}',
  'GET'
>;

type test4 = ResponseBody<
  InputOutput,
  '/entities/by-name/{kind}/{namespace}/{name}',
  'GET'
>;
type Method = DocPath<InputOutput>;
type why = DocPathMethod<
  InputOutput,
  '/entities/by-name/{kind}/{namespace}/{name}'
>;

type test5 = MethodAwareDocPath<InputOutput, '/entities', 'GET'>;

const router: TypedRouter = Router() as TypedRouter;
router.post('/entities/by-refs', (req, res) => {
  res.json([{}]);
});
