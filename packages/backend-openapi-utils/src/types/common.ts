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

import { FromSchema, JSONSchema7 } from 'json-schema-to-ts';
import {
  ImmutableContentObject,
  ImmutableOpenAPIObject,
  ImmutableReferenceObject,
} from './immutable';

/**
 * Basic OpenAPI spec with paths and components properties enforced.
 */
export type RequiredDoc = Pick<ImmutableOpenAPIObject, 'paths' | 'components'>;

export type PathDoc = Pick<ImmutableOpenAPIObject, 'paths'>;

/**
 * Get value types of `T`.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Validate a string against OpenAPI path template, {@link https://spec.openapis.org/oas/v3.1.0#path-templating-matching}.
 *
 * @example
 * ```ts
 * const path: PathTemplate<"/posts/{postId}/comments/{commentId}"> = "/posts/:postId/comments/:commentId";
 * const pathWithoutParams: PathTemplate<"/posts/comments"> = "/posts/comments";
 * ```
 */
export type PathTemplate<Path extends string> =
  Path extends `${infer Prefix}{${infer PathName}}${infer Suffix}`
    ? `${Prefix}:${PathName}${PathTemplate<Suffix>}`
    : Path;

/**
 * Extract path as specified in OpenAPI `Doc` based on request path
 * @example
 * ```ts
 * const spec = {
 *   paths: {
 *       "/posts/{postId}/comments/{commentId}": {},
 *       "/posts/comments": {},
 *   }
 * };
 * const specPathWithParams: DocPath<typeof spec, "/posts/:postId/comments/:commentId"> = "/posts/{postId}/comments/{commentId}";
 * const specPathWithoutParams: DocPath<typeof spec, "/posts/comments"> = "/posts/comments";
 * ```
 */
export type DocPath<
  Doc extends PathDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
> = ValueOf<{
  [Template in Extract<
    keyof Doc['paths'],
    string
  >]: Path extends PathTemplate<Template> ? Template : never;
}>;

export type DocPathTemplate<Doc extends PathDoc> = PathTemplate<
  Extract<keyof Doc['paths'], string>
>;

export type DocPathMethod<
  Doc extends Pick<RequiredDoc, 'paths'>,
  Path extends DocPathTemplate<Doc>,
> = keyof Doc['paths'][DocPath<Doc, Path>];

export type MethodAwareDocPath<
  Doc extends PathDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends keyof Doc['paths'][Path],
> = ValueOf<{
  [Template in Extract<
    keyof Doc['paths'],
    string
  >]: Path extends PathTemplate<Template>
    ? Method extends DocPathMethod<Doc, Path>
      ? PathTemplate<Template>
      : never
    : never;
}>;

export type DocOperation<
  Doc extends RequiredDoc,
  Path extends keyof Doc['paths'],
  Method extends keyof Doc['paths'][Path],
> = Doc['paths'][Path][Method];

export type ComponentTypes<Doc extends RequiredDoc> = Extract<
  keyof Doc['components'],
  string
>;

export type ComponentRef<
  Doc extends RequiredDoc,
  Type extends ComponentTypes<Doc>,
  Ref extends ImmutableReferenceObject,
> = Ref extends { $ref: `#/components/${Type}/${infer Name}` }
  ? Name extends keyof Doc['components'][Type]
    ? Doc['components'][Type][Name] extends ImmutableReferenceObject
      ? ComponentRef<Doc, Type, Doc['components'][Type][Name]>
      : Doc['components'][Type][Name]
    : never
  : never;

export type SchemaRef<Doc extends RequiredDoc, Schema> = Schema extends {
  $ref: `#/components/schemas/${infer Name}`;
}
  ? 'schemas' extends keyof Doc['components']
    ? Name extends keyof Doc['components']['schemas']
      ? SchemaRef<Doc, Doc['components']['schemas'][Name]>
      : never
    : never
  : { [Key in keyof Schema]: SchemaRef<Doc, Schema[Key]> };

export type ObjectWithContentSchema<
  Doc extends RequiredDoc,
  Object extends { content?: ImmutableContentObject },
> = Object['content'] extends ImmutableContentObject
  ? SchemaRef<Doc, Object['content']['application/json']['schema']>
  : never;

/**
 * From {@link https://stackoverflow.com/questions/71393738/typescript-intersection-not-union-type-from-json-schema}
 *
 * StackOverflow says not to do this, but union types aren't possible any other way.
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

export type Push<T extends any[], V> = [...T, V];

export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

export type ConvertAll<T, R extends ReadonlyArray<unknown> = []> = T extends [
  infer First extends JSONSchema7,
  ...infer Rest,
]
  ? ConvertAll<Rest, [...R, FromSchema<First>]>
  : R;

export type UnknownIfNever<P> = [P] extends [never] ? unknown : P;

export type ToTypeSafe<T> = UnknownIfNever<ConvertAll<TuplifyUnion<T>>[number]>;

export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = Extract<
  T,
  Record<K, V>
>;

export type MapDiscriminatedUnion<
  T extends Record<K, string>,
  K extends keyof T,
> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

export type PickOptionalKeys<T extends { [key: string]: any }> = {
  [K in keyof T]: true extends T[K]['required'] ? never : K;
}[keyof T];

export type PickRequiredKeys<T extends { [key: string]: any }> = {
  [K in keyof T]: true extends T[K]['required'] ? K : never;
}[keyof T];

export type OptionalMap<T extends { [key: string]: any }> = {
  [P in Exclude<PickOptionalKeys<T>, undefined>]?: NonNullable<T[P]>;
};

export type RequiredMap<T extends { [key: string]: any }> = {
  [P in Exclude<PickRequiredKeys<T>, undefined>]: NonNullable<T[P]>;
};

export type FullMap<T extends { [key: string]: any }> = RequiredMap<T> &
  OptionalMap<T>;

export type Filter<T, U> = T extends U ? T : never;
