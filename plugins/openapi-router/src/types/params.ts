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
  ImmutableHeaderObject,
  ImmutableParameterObject,
  ImmutableReferenceObject,
} from './immutable';
import {
  ComponentRef,
  ComponentTypes,
  DocOperation,
  DocPathTemplate,
  PathTemplate,
  RequiredDoc,
  TuplifyUnion,
} from './common';
import spec from '../schema/petstore';
import { ParameterLocation } from 'openapi3-ts';

export type ResolveDocParameter<
  Doc extends RequiredDoc,
  Path extends Extract<keyof Doc['paths'], string>,
  Method extends keyof Doc['paths'][Path],
  Parameter extends keyof Doc['paths'][Path][Method]['parameters'],
> = DocOperation<
  Doc,
  Path,
  Method
>['parameters'][Parameter] extends ImmutableReferenceObject
  ? 'parameters' extends ComponentTypes<Doc>
    ? ComponentRef<
        Doc,
        'parameters',
        DocOperation<Doc, Path, Method>['parameter'][Parameter]
      >
    : never
  : DocOperation<Doc, Path, Method>['parameters'][Parameter];

export type DocParameter<
  Doc extends RequiredDoc,
  Path extends Extract<keyof Doc['paths'], string>,
  Method extends keyof Doc['paths'][Path],
  Parameter extends keyof Doc['paths'][Path][Method]['parameters'],
> = ResolveDocParameter<
  Doc,
  Path,
  Method,
  Parameter
> extends ImmutableParameterObject
  ? ResolveDocParameter<Doc, Path, Method, Parameter>
  : never;

type KeysMatching<T extends any[], V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
/**
 * @public
 */
export type ConvertAll<T, R extends ReadonlyArray<unknown> = []> = T extends [
  infer First extends JSONSchema7,
  ...infer Rest,
]
  ? ConvertAll<Rest, [...R, FromSchema<First>]>
  : R;
/**
 * @public
 */
export type DocParameters<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends keyof Doc['paths'][Path],
> = TuplifyUnion<>;

export type HeaderSchema<
  Doc extends RequiredDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends keyof Doc['paths'][Path],
> = KeysMatching<DocParameters<Doc, Path, Method>, ImmutableHeaderObject>;

type keys = HeaderSchema<typeof spec, '/pets', 'get'>;

type match = KeysMatching<[1, 2, 3], 1>;
