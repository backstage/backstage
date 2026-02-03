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
  ImmutableCookieObject,
  ImmutableHeaderObject,
  ImmutableParameterObject,
  ImmutablePathObject,
  ImmutableQueryObject,
  ImmutableReferenceObject,
  ImmutableSchemaObject,
} from './immutable';
import {
  ComponentRef,
  ComponentTypes,
  DocOperation,
  DocPath,
  DocPathMethod,
  Filter,
  FullMap,
  MapDiscriminatedUnion,
  RequiredDoc,
  SchemaRef,
  ValueOf,
} from './common';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

/**
 * @public
 */
export type DocParameter<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
  Parameter extends keyof DocOperation<Doc, Path, Method>['parameters'],
> = DocOperation<
  Doc,
  Path,
  Method
>['parameters'][Parameter] extends ImmutableReferenceObject
  ? 'parameters' extends ComponentTypes<Doc>
    ? ComponentRef<
        Doc,
        'parameters',
        DocOperation<Doc, Path, Method>['parameters'][Parameter]
      >
    : never
  : DocOperation<Doc, Path, Method>['parameters'][Parameter];

/**
 * Helper to convert from string to number, used to index arrays and pull out just the indices in the array.
 * @public
 */
export type FromNumberStringToNumber<
  NumberString extends string | number | symbol,
> = NumberString extends `${infer R extends number}` ? R : never;

/**
 * @public
 */
export type DocParameters<
  Doc extends RequiredDoc,
  Path extends Extract<keyof Doc['paths'], string>,
  Method extends keyof Doc['paths'][Path],
> = {
  [Index in keyof DocOperation<
    Doc,
    Path,
    Method
  >['parameters'] as FromNumberStringToNumber<Index>]: DocParameter<
    Doc,
    Path,
    Method,
    Index
  >;
};

/**
 * @public
 */
export type ParameterSchema<
  Doc extends RequiredDoc,
  Schema extends ImmutableParameterObject['schema'],
> = SchemaRef<Doc, Schema> extends infer R
  ? R extends ImmutableSchemaObject
    ? R extends JSONSchema
      ? FromSchema<R>
      : never
    : never
  : never;

/**
 * @public
 */
export type MapToSchema<
  Doc extends RequiredDoc,
  T extends Record<string, ImmutableParameterObject>,
> = {
  [V in keyof T]: NonNullable<T[V]> extends ImmutableParameterObject
    ? ParameterSchema<Doc, NonNullable<T[V]>['schema']>
    : never;
};

/**
 * @public
 */
export type ParametersSchema<
  Doc extends RequiredDoc,
  Path extends Extract<keyof Doc['paths'], string>,
  Method extends keyof Doc['paths'][Path],
  FilterType extends ImmutableParameterObject,
> = MapToSchema<
  Doc,
  FullMap<
    MapDiscriminatedUnion<
      Filter<ValueOf<DocParameters<Doc, Path, Method>>, FilterType>,
      'name'
    >
  >
>;

/**
 * @public
 */
export type HeaderSchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ParametersSchema<Doc, Path, Method, ImmutableHeaderObject>;

/**
 * @public
 */
export type CookieSchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ParametersSchema<Doc, Path, Method, ImmutableCookieObject>;

/**
 * @public
 */
export type PathSchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ParametersSchema<Doc, Path, Method, ImmutablePathObject>;

/**
 * @public
 */
export type QuerySchema<
  Doc extends RequiredDoc,
  Path extends DocPath<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = ParametersSchema<Doc, Path, Method, ImmutableQueryObject>;
