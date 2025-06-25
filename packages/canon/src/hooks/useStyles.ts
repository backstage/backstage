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
import { componentDefinitions } from '../utils/componentDefinitions';
import type { ComponentDefinitionName, ComponentClassNames } from '../types';

/**
 * Resolve a responsive value based on the current breakpoint
 * @param value - The responsive value (string or object with breakpoint keys)
 * @param breakpoint - The current breakpoint
 * @returns The resolved value for the current breakpoint
 */
function resolveResponsiveValue(
  value: string | Record<string, string>,
  breakpoint: string,
): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const index = breakpoints.findIndex(b => b.id === breakpoint);

    // Look for value at current breakpoint or smaller
    for (let i = index; i >= 0; i--) {
      if (value[breakpoints[i].id]) {
        return value[breakpoints[i].id];
      }
    }

    // If no value found, check from smallest breakpoint up
    for (let i = 0; i < breakpoints.length; i++) {
      if (value[breakpoints[i].id]) {
        return value[breakpoints[i].id];
      }
    }
  }

  return undefined;
}

/**
 * React hook to get class names and data attributes for a component with responsive support
 * @param componentName - The name of the component
 * @param props - Object with prop values (can be responsive)
 * @returns Object with classNames and dataAttributes
 */
export function useStyles<T extends ComponentDefinitionName>(
  componentName: T,
  props: Record<string, any> = {},
): {
  classNames: ComponentClassNames<T>;
  dataAttributes: Record<string, string>;
  resolvedProps: Record<string, string>;
} {
  const { breakpoint } = useBreakpoint();
  const classNames = componentDefinitions[componentName]
    .classNames as ComponentClassNames<T>;

  // Resolve responsive values and generate data attributes
  const dataAttributes: Record<string, string> = {};
  const resolvedProps: Record<string, string> = {};

  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined && value !== null) {
      const resolvedValue = resolveResponsiveValue(value, breakpoint);
      if (resolvedValue !== undefined) {
        resolvedProps[key] = resolvedValue;
        dataAttributes[`data-${key}`] = resolvedValue;
      }
    }
  }

  return {
    classNames,
    dataAttributes,
    resolvedProps, // Also return resolved props for convenience
  };
}
