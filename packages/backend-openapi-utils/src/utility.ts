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
import {
  CookieSchema,
  DocPathTemplateMethod,
  HeaderSchema,
  PathSchema,
  PathTemplate,
  QuerySchema,
  RequestBodyToJsonSchema,
  RequiredDoc,
  ResponseBodyToJsonSchema,
  TemplateToDocPath,
} from './types';

/**
 * @public
 */
export type Response<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathTemplateMethod<Doc, Path>,
> = ResponseBodyToJsonSchema<Doc, TemplateToDocPath<Doc, Path>, Method>;

/**
 * @public
 */
export type Request<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathTemplateMethod<Doc, Path>,
> = RequestBodyToJsonSchema<Doc, TemplateToDocPath<Doc, Path>, Method>;

/**
 * @public
 */
export type HeaderParameters<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathTemplateMethod<Doc, Path>,
> = HeaderSchema<Doc, TemplateToDocPath<Doc, Path>, Method>;

/**
 * @public
 */
export type CookieParameters<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathTemplateMethod<Doc, Path>,
> = CookieSchema<Doc, TemplateToDocPath<Doc, Path>, Method>;

/**
 * @public
 */
export type PathParameters<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathTemplateMethod<Doc, Path>,
> = PathSchema<Doc, TemplateToDocPath<Doc, Path>, Method>;

/**
 * @public
 */
export type QueryParameters<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends DocPathTemplateMethod<Doc, Path>,
> = QuerySchema<Doc, TemplateToDocPath<Doc, Path>, Method>;
