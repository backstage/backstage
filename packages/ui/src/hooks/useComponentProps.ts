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

import { useBreakpoint, breakpoints } from './useBreakpoint';
import type { Breakpoint, RAExtendingComponentDefinition } from '../types';
import { applyDefaults, resolveResponsiveValue } from './helpers';

type Responsive<T, BP extends string = Breakpoint> = Partial<Record<BP, T>>;
type ResolvedValue<T> = T extends Responsive<infer V, any> ? V : T;

export function useComponentProps<
  Def extends RAExtendingComponentDefinition<any, any>,
  All extends Record<string, any>,
>(
  definition: Def,
  props: All,
): {
  // === Important: use *the same* key union (K) in both buckets ===
  ownProps: {
    [P in Extract<
      Extract<keyof Def['ownProps'], string>,
      keyof All
    >]: ResolvedValue<All[P]>;
  };
  inheritedProps: Omit<
    All,
    Extract<Extract<keyof Def['ownProps'], string>, keyof All>
  >;
} {
  const { breakpoint } = useBreakpoint();

  // Canonical key unions
  type KDef = Extract<keyof Def['ownProps'], string>;
  type K = Extract<KDef, keyof All>; // keys we’ll actually produce

  // Optional compile-time sanity check: all own keys must exist in `All`
  type Missing = Exclude<KDef, keyof All>;
  type __EnsureAllOwnInAll = [Missing] extends [never]
    ? unknown
    : { __ERROR_OWN_KEYS_MISSING_IN_All: Missing };
  void (null as unknown as __EnsureAllOwnInAll);

  // Typed own keys from the map (Object.keys gives strings)
  const ownKeys = Object.keys(definition.ownProps) as KDef[];

  // Apply defaults (use your typed version if you have it)
  const propsWithDefaults = applyDefaults(definition, props);

  // Build typed ownProps using precisely K
  const ownProps = {} as { [P in K]: ResolvedValue<All[P]> };
  for (const k of ownKeys) {
    // If you keep the Missing-check above, KDef ≡ K; otherwise narrow to K at use:
    const key = k as K;
    const v = propsWithDefaults[key]; // v: All[K]
    const resolved = resolveResponsiveValue(
      v,
      breakpoint,
      breakpoints,
    ) as ResolvedValue<typeof v>;
    (ownProps as any)[key] = resolved ?? v;
  }

  // Build inherited by deleting own keys from a shallow copy
  const inheritedDraft = { ...propsWithDefaults };
  // const inheritedDraft = { ...(propsWithDefaults as any) } as Omit<All, K> &
  //   Partial<Pick<All, K>>;
  for (const k of ownKeys) delete inheritedDraft[k];

  return {
    ownProps: ownProps as {
      [P in Extract<
        Extract<keyof Def['ownProps'], string>,
        keyof All
      >]: ResolvedValue<All[P]>;
    },
    inheritedProps: inheritedDraft as Omit<
      All,
      Extract<Extract<keyof Def['ownProps'], string>, keyof All>
    >,
  };
}
