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

import type { ComponentDefinition } from '../types';

type OwnOf<Def> = Def extends ComponentDefinition<infer O, any> ? O : never;

type DefaultsKeys<D extends ComponentDefinition<any, any>> = keyof NonNullable<
  D['defaults']
>;
type WithAppliedDefaults<
  D extends ComponentDefinition<any, any>,
  All extends Record<string, any>,
> = All & Required<Pick<OwnOf<D>, DefaultsKeys<D>>>;

/**
 * Apply default values from definition to props
 * @internal
 */
export function applyDefaults<
  D extends ComponentDefinition<any, any>,
  All extends Record<string, any>,
>(definition: D, props: All): WithAppliedDefaults<D, All> {
  if (!definition.defaults) return props as WithAppliedDefaults<D, All>;

  // Start with a shallow copy
  const result: Record<string, any> = { ...props };

  // Iterate keys of defaults with strong key typing
  for (const key of Object.keys(definition.defaults) as Array<
    keyof NonNullable<D['defaults']> & string
  >) {
    if (result[key] === undefined) {
      result[key] = (definition.defaults as Record<string, any>)[key];
    }
  }

  return result as WithAppliedDefaults<D, All>;
}

/**
 * Resolve a responsive value based on the current breakpoint
 * @internal
 */
export function resolveResponsiveValue(
  value: unknown,
  breakpoint: string,
  breakpoints: Array<{ id: string; name: string; value: number }>,
): string | undefined {
  // Simple value - return as-is
  if (typeof value === 'string') {
    return value;
  }

  // Not an object - can't resolve
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const breakpointValues = value as Record<string, string>;
  const index = breakpoints.findIndex(b => b.id === breakpoint);

  // Look backward from current breakpoint to smallest
  for (let i = index; i >= 0; i--) {
    const bpId = breakpoints[i].id;
    if (breakpointValues[bpId] !== undefined) {
      return breakpointValues[bpId];
    }
  }

  // Look forward from smallest breakpoint
  for (let i = 0; i < breakpoints.length; i++) {
    const bpId = breakpoints[i].id;
    if (breakpointValues[bpId] !== undefined) {
      return breakpointValues[bpId];
    }
  }

  return undefined;
}
