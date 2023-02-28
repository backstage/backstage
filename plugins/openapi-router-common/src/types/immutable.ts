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
import type {
  ContentObject as MutableContentObject,
  OpenAPIObject as MutableOpenApiObject,
  ReferenceObject as MutableReferenceObject,
  RequestBodyObject as MutableRequestBodyObject,
} from 'openapi3-ts';

/**
 * This file is meant to hold Immutable overwrites of the values provided by the `openapi3-ts`
 *  package due to issues with `as const` supporting only readonly values.
 */

export type Immutable<T> = T extends
  | Function
  | boolean
  | number
  | string
  | null
  | undefined
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<Immutable<K>, Immutable<V>>
  : T extends Set<infer S>
  ? ReadonlySet<Immutable<S>>
  : { readonly [P in keyof T]: Immutable<T[P]> };

// This works for objects, arrays and tuples:
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export type ReferenceObject = ImmutableObject<MutableReferenceObject>;

export type OpenAPIObject = ImmutableObject<MutableOpenApiObject>;

export type ContentObject = ImmutableObject<MutableContentObject>;

export type RequestBodyObject = ImmutableObject<MutableRequestBodyObject>;
