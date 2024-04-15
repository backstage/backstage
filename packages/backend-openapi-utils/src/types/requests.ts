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

/**
 * Pulled from https://github.com/varanauskas/oatx.
 */

import type {
  ComponentRef,
  ComponentTypes,
  ObjectWithContentSchema,
  RequiredDoc,
  DocOperation,
  DocPath,
  DocPathMethod,
  ToTypeSafe,
} from './common';
import {
  ImmutableReferenceObject,
  ImmutableRequestBodyObject,
} from './immutable';

/**
 * @public
 */
export type RequestBody<
  Doc extends RequiredDoc,
  Path extends Extract<keyof Doc['paths'], string>,
  Method extends keyof Doc['paths'][Path],
> = DocOperation<
  Doc,
  Path,
  Method
>['requestBody'] extends ImmutableReferenceObject
  ? 'requestBodies' extends ComponentTypes<Doc>
    ? ComponentRef<
        Doc,
        'requestBodies',
        DocOperation<Doc, Path, Method>['requestBody']
      >
    : never
  : DocOperation<Doc, Path, Method>['requestBody'];

/**
 * @public
 */
export type RequestBodySchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> =
  RequestBody<Doc, Path, Method> extends ImmutableRequestBodyObject
    ? ObjectWithContentSchema<Doc, RequestBody<Doc, Path, Method>>
    : never;

/**
 * Transform the OpenAPI request body schema to a typesafe JSON schema.
 * @public
 */
export type RequestBodyToJsonSchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ToTypeSafe<RequestBodySchema<Doc, Path, Method>>;
