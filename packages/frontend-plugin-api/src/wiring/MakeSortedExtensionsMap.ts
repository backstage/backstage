/*
 * Copyright 2025 The Backstage Authors
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

import { ExtensionDefinition } from './createExtension';
import { ResolveExtensionId } from './resolveExtensionDefinition';

// NOTE: Do not export any utilities in this file. If you want to use them, make a copy and keep them contained.

// Printable ASCII characters in kinds and names are compared in ASCII order.
// Other characters have no fixed order.
type CompareChars<A extends string, B extends string> = [A, B] extends [
  `${infer IAHead}${infer IARest}`,
  `${infer IBHead}${infer IBRest}`,
]
  ? IAHead extends IBHead
    ? IBRest extends ''
      ? IARest extends ''
        ? 'eq'
        : 'gt'
      : IARest extends ''
      ? 'lt'
      : CompareChars<IARest, IBRest>
    : ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' extends `${string}${IAHead}${string}${IBHead}${string}`
    ? 'lt'
    : 'gt'
  : 'eq';

type CompareStrings<
  A extends string | undefined,
  B extends string | undefined,
> = A extends B
  ? 'eq'
  : A extends undefined
  ? 'lt'
  : B extends undefined
  ? 'gt'
  : CompareChars<A & string, B & string>;

// The extensions are sorted by these keys rather than by the full extension
// types, since the full types make the sorting too expensive for plugins with
// many extensions. The key is the extension ID with an empty plugin ID, which
// keeps the sorting independent of the plugin ID. After sorting, the key is
// used to look up the extensions again, which are then mapped by their own IDs.
type ExtensionSortKey = {
  kind: string | undefined;
  name: string | undefined;
  key: string;
};

// The kind, name and key are inferred first, so that the sort keys don't
// refer to the full extension types.
type ToSortKey<UExtensions extends ExtensionDefinition> =
  UExtensions extends ExtensionDefinition<{
    kind: infer IKind extends string | undefined;
    name: infer IName extends string | undefined;
    params: any;
  }>
    ? ResolveExtensionId<UExtensions, ''> extends infer IKey extends string
      ? [IKey] extends [never]
        ? never
        : { kind: IKind; name: IName; key: IKey }
      : never
    : never;

type CompareSortKeys<
  A extends ExtensionSortKey,
  B extends ExtensionSortKey,
> = CompareStrings<A['kind'], B['kind']> extends 'eq'
  ? CompareStrings<A['name'], B['name']>
  : CompareStrings<A['kind'], B['kind']>;

// Insertion sort, with both types tail recursive. A quicksort of the keys hits
// the instantiation depth limit when many extensions are already in order or
// in reverse order.
type InsertSortKey<
  TKey extends ExtensionSortKey,
  TSorted extends readonly ExtensionSortKey[],
  TLow extends readonly ExtensionSortKey[] = [],
> = TSorted extends [
  infer IHead extends ExtensionSortKey,
  ...infer IRest extends readonly ExtensionSortKey[],
]
  ? CompareSortKeys<TKey, IHead> extends 'lt'
    ? [...TLow, TKey, ...TSorted]
    : InsertSortKey<TKey, IRest, [...TLow, IHead]>
  : [...TLow, TKey];

type SortKeys<
  TKeys extends readonly ExtensionSortKey[],
  TSorted extends readonly ExtensionSortKey[] = [],
> = TKeys extends [
  infer IHead extends ExtensionSortKey,
  ...infer IRest extends readonly ExtensionSortKey[],
]
  ? SortKeys<IRest, InsertSortKey<IHead, TSorted>>
  : TSorted;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

// Only removes R and types equivalent to R from U, since Exclude also removes
// subtypes of R, such as a key with a literal name when R has a template
// literal name
type PopUnion<U> = UnionToIntersection<
  U extends any ? () => U : never
> extends () => infer R
  ? [next: R, rest: U extends R ? (R extends U ? never : U) : U]
  : undefined;

type UnionToArray<U, T = U, TResult extends T[] = []> = PopUnion<U> extends [
  next: infer INext extends T,
  rest: infer IRest extends T,
]
  ? UnionToArray<IRest, T, [INext, ...TResult]>
  : TResult;

type ExtensionsByKey<UExtensions extends ExtensionDefinition> = {
  [KExtension in UExtensions as ResolveExtensionId<KExtension, ''>]: KExtension;
};

type ExtensionArrayToMap<
  T extends readonly ExtensionDefinition[],
  TId extends string,
  TOut extends { [KId in string]: ExtensionDefinition } = {},
> = T extends [
  infer IHead extends ExtensionDefinition,
  ...infer IRest extends readonly ExtensionDefinition[],
]
  ? ExtensionArrayToMap<
      IRest,
      TId,
      TOut & { [K in ResolveExtensionId<IHead, TId>]: IHead }
    >
  : TOut;

// Maps each extension by its own IDs, so that an extension with a union of
// names keeps all of its IDs. The extensions are mapped one by one, since a
// distributive conditional type over the extensions would stay unresolved in
// the declarations of generic plugin factories, which makes them expensive to
// use.
type ExtensionsToMap<
  UExtensions extends ExtensionDefinition,
  TId extends string,
> = [UExtensions] extends [UnionToIntersection<UExtensions>]
  ? { [K in ResolveExtensionId<UExtensions, TId>]: UExtensions }
  : ExtensionArrayToMap<UnionToArray<UExtensions>, TId>;

type SortKeysToMap<
  TKeys extends readonly ExtensionSortKey[],
  TExtensionsByKey extends { [KKey in string]: ExtensionDefinition },
  TId extends string,
  TOut extends { [KId in string]: ExtensionDefinition } = {},
> = TKeys extends [
  infer IHead extends ExtensionSortKey,
  ...infer IRest extends readonly ExtensionSortKey[],
]
  ? SortKeysToMap<
      IRest,
      TExtensionsByKey,
      TId,
      TOut & ExtensionsToMap<TExtensionsByKey[IHead['key']], TId>
    >
  : TOut extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

// This was added to stability API reports. Before this was added the extensions
// listed in API reports would be reordered fairly arbitrarily on changes in
// unrelated packages, which made for a confusing contribution experience. This
// also makes it slightly easier to find extensions that you're looking for in
// the API reports.
//
// If this causes any type of trouble there is no risk in removing it from a
// correctness or API stability point of view.
/** @ignore */
export type MakeSortedExtensionsMap<
  UExtensions extends ExtensionDefinition,
  TId extends string,
> = SortKeysToMap<
  SortKeys<UnionToArray<ToSortKey<UExtensions>>>,
  ExtensionsByKey<UExtensions>,
  TId
>;
