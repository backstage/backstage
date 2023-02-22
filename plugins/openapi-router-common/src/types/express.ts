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
import core from 'express-serve-static-core';
import { DocPathTemplate, MethodAwareDocPath, RequiredDoc } from './common';
import { RequestBodyToJsonSchema } from './requests';
import { ResponseBodyToJsonSchema } from './response';

interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export type DocRequestHandler<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends keyof Doc['paths'][Path],
> = core.RequestHandler<
  core.ParamsDictionary,
  ResponseBodyToJsonSchema<Doc, Path, Method>,
  RequestBodyToJsonSchema<Doc, Path, Method>,
  ParsedQs,
  Record<string, string>
>;

export type DocRequestHandlerParams<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends keyof Doc['paths'][Path],
> = core.RequestHandlerParams<
  core.ParamsDictionary,
  ResponseBodyToJsonSchema<Doc, Path, Method>,
  RequestBodyToJsonSchema<Doc, Path, Method>,
  ParsedQs,
  Record<string, string>
>;

export type PathParams = string | RegExp | Array<string | RegExp>;

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
  <Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, Method>>(
    path: Path,
    ...handlers: Array<DocRequestHandler<Doc, Path, Method>>
  ): T;
  <Path extends MethodAwareDocPath<Doc, DocPathTemplate<Doc>, Method>>(
    path: Path,
    ...handlers: Array<DocRequestHandlerParams<Doc, Path, Method>>
  ): T;
}
