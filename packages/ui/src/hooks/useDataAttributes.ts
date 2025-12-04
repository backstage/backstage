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
import { applyDefaults, resolveResponsiveValue } from './helpers';
import type { ComponentDefinition } from '../types';

// --- Helper types ---

type AnyProps = Record<string, any>;
type AnyStyles = Readonly<Record<string, string>>;
type AnyComponentDefinition = ComponentDefinition<AnyProps, AnyStyles>;

type EnsureSubtype<Sub extends Super, Super> = Sub;

// --- Base union for impl ---

export type DataAttributesBase = Record<`data-${string}`, string> | undefined;

// --- Internal impl (no hooks; breakpoint is passed in) ---

function dataAttributesImpl(
  definition: AnyComponentDefinition,
  props: AnyProps,
  breakpoint: string, // or Breakpoint if you have a stricter type
): DataAttributesBase {
  const { dataAttributes } = definition;
  if (!dataAttributes?.length) return undefined;

  const result: Record<`data-${string}`, string> = {};
  const propsWithDefaults = applyDefaults(definition, props);

  for (const key of dataAttributes) {
    const propKey = String(key);
    const value = propsWithDefaults[propKey];

    if (value === undefined || value === null) {
      continue;
    }

    // Handle boolean/number - convert directly to string
    if (typeof value === 'boolean' || typeof value === 'number') {
      result[`data-${propKey}`] = String(value);
      continue;
    }

    // Resolve responsive value
    const resolved = resolveResponsiveValue(value, breakpoint, breakpoints);
    if (resolved !== undefined) {
      result[`data-${propKey}`] = resolved;
    }
  }

  return result;
}

// --- Public conditional result type ---

export type DataAttributesResult<Def extends AnyComponentDefinition> =
  Def extends {
    dataAttributes: readonly (keyof any)[];
  }
    ? Record<`data-${string}`, string>
    : undefined;

type _CheckDataAttrsSafe = EnsureSubtype<
  DataAttributesResult<AnyComponentDefinition>,
  DataAttributesBase
>;

// --- Exported hook ---

export function useDataAttributes<
  Def extends AnyComponentDefinition,
  All extends AnyProps,
>(definition: Def, props: All): DataAttributesResult<Def> {
  const { breakpoint } = useBreakpoint();

  const base = dataAttributesImpl(
    definition as AnyComponentDefinition,
    props as AnyProps,
    breakpoint,
  );

  return base as DataAttributesResult<Def>;
}
