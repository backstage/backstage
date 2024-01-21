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
            path: {
            },
            query: {
            },
                body: AnalyzeLocationRequest,
            response: AnalyzeLocationResponse,
        },
        
        
        '#POST|/locations': {
            path: {
            },
            query: {
                    dryRun?: string,
            },
                body: CreateLocationRequest,
            response: CreateLocation201Response,
        },
        
        
        '#DELETE|/entities/by-uid/{uid}': {
            path: {
                    uid: string,
            },
            query: {
            },
            response: void,
        },
        
        
        '#DELETE|/locations/{id}': {
            path: {
                    id: string,
            },
            query: {
            },
            response: void,
        },
        
        
        '#GET|/entities': {
            path: {
            },
            query: {
                    fields?: Array<string>,
                    limit?: number,
                    filter?: Array<string>,
                    offset?: number,
                    after?: string,
                    order?: Array<string>,
            },
            response: Array<Entity>,
        },
        
        
        '#GET|/entities/by-query': {
            path: {
            },
            query: {
                    fields?: Array<string>,
                    limit?: number,
                    orderField?: Array<string>,
                    cursor?: string,
                    filter?: Array<string>,
                    fullTextFilterTerm?: string,
                    fullTextFilterFields?: Array<string>,
            },
            response: EntitiesQueryResponse,
        },
        
        
        '#POST|/entities/by-refs': {
            path: {
            },
            query: {
            },
                body: GetEntitiesByRefsRequest,
            response: EntitiesBatchResponse,
        },
        
        
        '#GET|/entities/by-name/{kind}/{namespace}/{name}/ancestry': {
            path: {
                    kind: string,
                    namespace: string,
                    name: string,
            },
            query: {
            },
            response: EntityAncestryResponse,
        },
        
        
        '#GET|/entities/by-name/{kind}/{namespace}/{name}': {
            path: {
                    kind: string,
                    namespace: string,
                    name: string,
            },
            query: {
            },
            response: Entity,
        },
        
        
        '#GET|/entities/by-uid/{uid}': {
            path: {
                    uid: string,
            },
            query: {
            },
            response: Entity,
        },
        
        
        '#GET|/entity-facets': {
            path: {
            },
            query: {
                    facet: Array<string>,
                    filter?: Array<string>,
            },
            response: EntityFacetsResponse,
        },
        
        
        '#GET|/locations/{id}': {
            path: {
                    id: string,
            },
            query: {
            },
            response: Location,
        },
        
        
        '#GET|/locations': {
            path: {
            },
            query: {
            },
            response: Array<GetLocations200ResponseInner>,
        },
        
        
        '#POST|/refresh': {
            path: {
            },
            query: {
            },
                body: RefreshEntityRequest,
            response: void,
        },
        
        
        '#POST|/validate-entity': {
            path: {
            },
            query: {
            },
                body: ValidateEntityRequest,
            response: void,
        },
        
    };

type ValueOf<T> = T[keyof T]; 

type Filter<T, K> = T extends K ? K : never;

type ExtractDocPath<Path extends string> = Path extends `#${string}|${infer OpenApiPath}` ? OpenApiPath : never;

type ExtractDocMethod<Path extends string> = Path extends `#${infer Method}|${string}` ? Method : never

type DocPath<Doc extends InputOutput> = ExtractDocPath<Filter<keyof Doc, string>>;

type DocPathMethod<Doc extends InputOutput, Path extends string> = ExtractDocMethod<Path>;

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
  ResponseBodyToJsonSchema<Doc, Path, Method>,
  RequestBodyToJsonSchema<Doc, Path, Method>,
  QuerySchema<Doc, Path, Method>,
  Record<string, string>
>;

/**
 * Typed express error handler / request handler union type.
 * @public
 */
export type DocRequestHandlerParams<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = core.RequestHandlerParams<
  PathSchema<Doc, Path, Method>,
  ResponseBodyToJsonSchema<Doc, Path, Method>,
  RequestBodyToJsonSchema<Doc, Path, Method>,
  QuerySchema<Doc, Path, Method>,
  Record<string, string>
>;

/**
 * Superset of the express router path matcher that enforces typed request and response bodies.
 * @public
 */
export interface DocRequestMatcher<
  Doc extends RequiredDoc,
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
    Path extends MethodAwareDocPath<
      Doc,
      PathTemplate<Extract<keyof Doc['paths'], string>>,
      Method
    >,
  >(
    path: Path,
    ...handlers: Array<
      DocRequestHandler<Doc, TemplateToDocPath<Doc, Path>, Method>
    >
  ): T;
  <
    Path extends MethodAwareDocPath<
      Doc,
      PathTemplate<Extract<keyof Doc['paths'], string>>,
      Method
    >,
  >(
    path: Path,
    ...handlers: Array<
      DocRequestHandlerParams<Doc, TemplateToDocPath<Doc, Path>, Method>
    >
  ): T;
}

export interface TypedRouter extends Router {
    get: 
}
