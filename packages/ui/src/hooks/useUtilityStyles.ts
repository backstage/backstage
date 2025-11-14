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

import clsx from 'clsx';
import type { Breakpoint, ComponentDefinition } from '../types';
import { utilityClassMap } from '../utils/utilityClassMap';
import { breakpoints, useBreakpoint } from './useBreakpoint';
import { applyDefaults, resolveResponsiveValue } from './helpers';

type Responsive<T, BP extends string = Breakpoint> = Partial<Record<BP, T>>;
type ResolvedValue<T> = T extends Responsive<infer V, any> ? V : T;

type UtilityConfig = {
  class: string;
  cssVar?: string;
  values: readonly (string | number)[];
};

/**
 * Process a single utility value and add to class list / style object
 * (unchanged logic)
 */
function processUtilityValue(
  value: unknown,
  utilityConfig: UtilityConfig,
  prefix: string,
  utilityClassList: string[],
  style: Record<string, unknown>,
): void {
  if (
    utilityConfig.values.length > 0 &&
    utilityConfig.values.includes(value as string | number)
  ) {
    const className = prefix
      ? `${prefix}${utilityConfig.class}-${value}`
      : `${utilityConfig.class}-${value}`;
    utilityClassList.push(className);
  } else if (utilityConfig.cssVar) {
    const cssVarKey = prefix
      ? `${utilityConfig.cssVar}-${prefix.slice(0, -1)}`
      : utilityConfig.cssVar;
    style[cssVarKey] = value;

    const className = prefix
      ? `${prefix}${utilityConfig.class}`
      : utilityConfig.class;
    utilityClassList.push(className);
  }
}

// Which keys are "utility" keys for this definition and also exist on All?
type UtilityKeys<
  Def extends ComponentDefinition<any, any>,
  All extends Record<string, any>,
> = Extract<
  NonNullable<Def['utilityProps']>[number],
  Extract<keyof All, string>
>;

// If there are no utility keys, return All; otherwise return Omit<All, K>
type PropsWithoutUtility<
  Def extends ComponentDefinition<any, any>,
  All extends Record<string, any>,
> = [UtilityKeys<Def, All>] extends [never]
  ? All
  : Omit<All, UtilityKeys<Def, All>>;

export function useUtilityStyles<
  Def extends ComponentDefinition<any, any>,
  All extends Record<string, any>,
>(
  definition: Def,
  props: All,
): {
  utilityClasses: string;
  style: React.CSSProperties;
  propsWithoutUtilities: PropsWithoutUtility<Def, All>;
} {
  const { breakpoint } = useBreakpoint();

  // Canonical key union of utility keys we will handle
  type K = UtilityKeys<Def, All>;

  // Normalise to an array; types now align with K (string keys)
  const utilityKeys = (definition.utilityProps ?? []) as ReadonlyArray<K>;

  const utilityClassList: string[] = [];
  const style: Record<string, unknown> = {};

  const propsWithDefaults = applyDefaults(definition, props) as All;

  for (const key of utilityKeys) {
    // Read the value with strong typing
    const value = propsWithDefaults[key] as All[K];

    if (value === undefined || value === null) continue;

    const utilityConfig = utilityClassMap[key as string]; // map is string-keyed
    if (!utilityConfig) continue;

    const resolved = resolveResponsiveValue(
      value,
      breakpoint,
      breakpoints,
    ) as ResolvedValue<All[K]>;

    if (typeof value === 'object' && value !== null) {
      const breakpointValues = value as { [key: string]: unknown };
      // Handle responsive object values
      for (const bp in breakpointValues) {
        const prefix = bp === 'initial' ? '' : `${bp}:`;
        processUtilityValue(
          resolved,
          utilityConfig,
          prefix,
          utilityClassList,
          style,
        );
      }
    } else {
      processUtilityValue(resolved, utilityConfig, '', utilityClassList, style);
    }
  }

  // Build propsWithoutUtilities by deleting K keys from a copy
  const propsWithoutUtilities = { ...(propsWithDefaults as any) } as [
    K,
  ] extends [never]
    ? All
    : Omit<All, K> & Partial<Pick<All, K>>;

  for (const k of utilityKeys) {
    delete (propsWithoutUtilities as any)[k];
  }
  const mergedStyles = {
    ...style,
    ...(props.style || {}),
  };

  if ('style' in propsWithoutUtilities) {
    propsWithoutUtilities.style = mergedStyles;
  }

  return {
    utilityClasses: clsx(utilityClassList),
    style: mergedStyles,
    // Collapse to All when K is never; otherwise Omit<All, K>
    propsWithoutUtilities: propsWithoutUtilities as PropsWithoutUtility<
      Def,
      All
    >,
  };
}
