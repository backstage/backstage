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
import type { ComponentDefinition } from '../types';
import { applyDefaults, resolveResponsiveValue } from './helpers';

/**
 * Generate data-* attributes from props with responsive resolution
 *
 * @param definition - Component definition with dataAttributes list
 * @param props - Component props
 * @returns Object with data-* prefixed attributes
 *
 * @public
 */
export function useDataAttributes<T extends ComponentDefinition<any, any>>(
  definition: T,
  props: Record<string, any>,
): Record<string, string> {
  const { breakpoint } = useBreakpoint();
  const dataAttributes: Record<string, string> = {};

  if (!definition.dataAttributes || definition.dataAttributes.length === 0) {
    return dataAttributes;
  }

  // Apply defaults first
  const propsWithDefaults = applyDefaults(definition, props);

  for (const key of definition.dataAttributes) {
    const propKey = String(key);
    const value = propsWithDefaults[propKey];

    if (value === undefined || value === null) {
      continue;
    }

    // Handle boolean/number - convert directly to string
    if (typeof value === 'boolean' || typeof value === 'number') {
      dataAttributes[`data-${propKey}`] = String(value);
      continue;
    }

    // Resolve responsive value
    const resolved = resolveResponsiveValue(value, breakpoint, breakpoints);
    if (resolved !== undefined) {
      dataAttributes[`data-${propKey}`] = resolved;
    }
  }

  return dataAttributes;
}
