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
    : `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz` extends `${string}${IAHead}${string}${IBHead}${string}`
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

type CompareExtensions<
  A extends ExtensionDefinition,
  B extends ExtensionDefinition,
> = CompareStrings<A['T']['kind'], B['T']['kind']> extends 'eq'
  ? CompareStrings<A['T']['name'], B['T']['name']>
  : CompareStrings<A['T']['kind'], B['T']['kind']>;

type SortExtensionsInner<
  TPivot extends ExtensionDefinition,
  TRest extends readonly ExtensionDefinition[],
  TLow extends readonly ExtensionDefinition[],
  THigh extends readonly ExtensionDefinition[],
> = TRest extends [
  infer IHead extends ExtensionDefinition,
  ...infer IRest extends readonly ExtensionDefinition[],
]
  ? CompareExtensions<IHead, TPivot> extends 'lt'
    ? SortExtensionsInner<TPivot, IRest, [...TLow, IHead], THigh>
    : SortExtensionsInner<TPivot, IRest, TLow, [...THigh, IHead]>
  : [low: TLow, high: THigh];

type SortExtensions<T extends readonly ExtensionDefinition[]> = T extends [
  infer IPivot extends ExtensionDefinition,
  ...infer IRest extends readonly ExtensionDefinition[],
]
  ? SortExtensionsInner<IPivot, IRest, [], []> extends [
      low: infer ILow extends readonly ExtensionDefinition[],
      high: infer IHigh extends readonly ExtensionDefinition[],
    ]
    ? [...SortExtensions<ILow>, IPivot, ...SortExtensions<IHigh>]
    : 'invalid SortExtensionsInner'
  : [];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type PopUnion<U> = UnionToIntersection<
  U extends any ? () => U : never
> extends () => infer R
  ? [next: R, rest: Exclude<U, R>]
  : undefined;

type UnionToArray<U, T = U, TResult extends T[] = []> = PopUnion<U> extends [
  next: infer INext extends T,
  rest: infer IRest extends T,
]
  ? UnionToArray<IRest, T, [INext, ...TResult]>
  : TResult;

type ExtensionArrayToMap<
  T extends ExtensionDefinition[],
  TId extends string,
  TOut extends { [KId in string]: ExtensionDefinition } = {},
> = T extends [
  infer IHead extends ExtensionDefinition,
  ...infer IRest extends ExtensionDefinition[],
]
  ? ExtensionArrayToMap<
      IRest,
      TId,
      TOut & { [K in ResolveExtensionId<IHead, TId>]: IHead }
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
> = ExtensionArrayToMap<SortExtensions<UnionToArray<UExtensions>>, TId>;
