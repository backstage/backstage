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
  DocPathMethod,
  ToTypeSafe,
  ValueOf,
  DocPath,
} from './common';
import { ImmutableReferenceObject, ImmutableResponseObject } from './immutable';

/**
 * @public
 */
export type Response<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
  StatusCode extends keyof DocOperation<Doc, Path, Method>['responses'],
> = DocOperation<
  Doc,
  Path,
  Method
>['responses'][StatusCode] extends ImmutableReferenceObject
  ? 'responses' extends ComponentTypes<Doc>
    ? ComponentRef<
        Doc,
        'responses',
        DocOperation<Doc, Path, Method>['responses'][StatusCode]
      >
    : never
  : DocOperation<Doc, Path, Method>['responses'][StatusCode];

/**
 * @public
 */
export type ResponseSchemas<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = {
  [StatusCode in keyof DocOperation<Doc, Path, Method>['responses']]: Response<
    Doc,
    Path,
    Method,
    StatusCode
  > extends ImmutableResponseObject
    ? ObjectWithContentSchema<Doc, Response<Doc, Path, Method, StatusCode>>
    : never;
};

/**
 * Transform the OpenAPI request body schema to a typesafe JSON schema.
 * @public
 */
export type ResponseBodyToJsonSchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ToTypeSafe<ValueOf<ResponseSchemas<Doc, Path, Method>>>;
