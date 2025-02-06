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
import { PathTemplate, ValueOf } from './common';

/**
 * @public
 */
export type EndpointMap = Record<
  string,
  { query?: object; body?: object; response?: object | void; path?: object }
>;

// OpenAPI generator doesn't emit regular lowercase 'delete'.
/**
 * @public
 */
export type HttpMethods = 'all' | 'put' | 'get' | 'post' | '_delete';

/**
 * @public
 */
export type StaticPathParamsSchema<
  Doc extends EndpointMap,
  Endpoint extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Endpoint>,
> = `#${Method}|${Endpoint}` extends keyof Doc
  ? 'path' extends keyof Doc[`#${Method}|${Endpoint}`]
    ? Doc[`#${Method}|${Endpoint}`]['path']
    : never
  : never;
/**
 * @public
 */
export type StaticRequestBodySchema<
  Doc extends EndpointMap,
  Endpoint extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Endpoint>,
> = `#${Method}|${Endpoint}` extends keyof Doc
  ? 'body' extends keyof Doc[`#${Method}|${Endpoint}`]
    ? Doc[`#${Method}|${Endpoint}`]['body']
    : unknown
  : unknown;
/**
 * @public
 */
export type StaticResponseSchema<
  Doc extends EndpointMap,
  Endpoint extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Endpoint>,
> = `#${Method}|${Endpoint}` extends keyof Doc
  ? 'response' extends keyof Doc[`#${Method}|${Endpoint}`]
    ? Doc[`#${Method}|${Endpoint}`]['response']
    : unknown
  : unknown;
/**
 * @public
 */
export type StaticQueryParamsSchema<
  Doc extends EndpointMap,
  Endpoint extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Endpoint>,
> = `#${Method}|${Endpoint}` extends keyof Doc
  ? 'query' extends keyof Doc[`#${Method}|${Endpoint}`]
    ? Doc[`#${Method}|${Endpoint}`]['query']
    : never
  : never;

/**
 * Typed express request handler.
 * @public
 */
export type EndpointMapRequestHandler<
  Doc extends EndpointMap,
  Path extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Path>,
> = core.RequestHandler<
  StaticPathParamsSchema<Doc, Path, Method>,
  StaticResponseSchema<Doc, Path, Method>,
  StaticRequestBodySchema<Doc, Path, Method>,
  StaticQueryParamsSchema<Doc, Path, Method>,
  Record<string, string>
>;

/**
 * Typed express error handler / request handler union type.
 * @public
 */
export type EndpointMapRequestHandlerParams<
  Doc extends EndpointMap,
  Path extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Path>,
> = core.RequestHandlerParams<
  StaticPathParamsSchema<Doc, Path, Method>,
  StaticResponseSchema<Doc, Path, Method>,
  StaticRequestBodySchema<Doc, Path, Method>,
  StaticQueryParamsSchema<Doc, Path, Method>,
  Record<string, string>
>;

/**
 * @public
 */
export type DocEndpoint<Doc extends EndpointMap> = ValueOf<{
  [Template in keyof Doc]: Template extends `#${string}|${infer Endpoint}`
    ? Endpoint
    : never;
}>;

/**
 * @public
 */
export type DocEndpointMethod<
  Doc extends EndpointMap,
  Endpoint extends DocEndpoint<Doc>,
> = ValueOf<{
  [Template in keyof Doc]: Template extends `#${infer Method}|${Endpoint}`
    ? Method
    : never;
}>;

/**
 * @public
 */
export type MethodAwareDocEndpoints<
  Doc extends EndpointMap,
  Endpoint extends DocEndpoint<Doc>,
  Method extends DocEndpointMethod<Doc, Endpoint>,
> = ValueOf<{
  [Template in keyof Doc]: Template extends `#${Method}|${infer E}`
    ? E extends DocEndpoint<Doc>
      ? PathTemplate<E>
      : never
    : never;
}>;

/**
 * @public
 */
export type DocEndpointTemplate<Doc extends EndpointMap> = PathTemplate<
  DocEndpoint<Doc>
>;

/**
 * @public
 */
export type TemplateToDocEndpoint<
  Doc extends EndpointMap,
  Path extends DocEndpointTemplate<Doc>,
> = ValueOf<{
  [Template in DocEndpoint<Doc>]: Path extends PathTemplate<Template>
    ? Template
    : never;
}>;

/**
 * Superset of the express router path matcher that enforces typed request and response bodies.
 * @public
 */
export interface EndpointMapRequestMatcher<
  Doc extends EndpointMap,
  T,
  Method extends HttpMethods,
> {
  <
    TPath extends MethodAwareDocEndpoints<
      Doc,
      DocEndpoint<Doc>,
      Method & DocEndpointMethod<Doc, DocEndpoint<Doc>>
    >,
    TMethod extends Method &
      DocEndpointMethod<Doc, TemplateToDocEndpoint<Doc, TPath>>,
  >(
    path: TPath,
    ...handlers: Array<
      EndpointMapRequestHandler<Doc, TemplateToDocEndpoint<Doc, TPath>, TMethod>
    >
  ): T;
  <
    TPath extends MethodAwareDocEndpoints<
      Doc,
      DocEndpoint<Doc>,
      Method & DocEndpointMethod<Doc, DocEndpoint<Doc>>
    >,
    TMethod extends Method &
      DocEndpointMethod<Doc, TemplateToDocEndpoint<Doc, TPath>>,
  >(
    path: TPath,
    ...handlers: Array<
      EndpointMapRequestHandlerParams<
        Doc,
        TemplateToDocEndpoint<Doc, TPath>,
        TMethod
      >
    >
  ): T;
}
