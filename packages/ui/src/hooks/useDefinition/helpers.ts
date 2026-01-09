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

import type { CSSProperties } from 'react';
import { breakpoints } from '../useBreakpoint';
import { utilityClassMap } from '../../utils/utilityClassMap';

/**
 * Resolve a responsive value based on the current breakpoint
 * @param value - The responsive value (string or object with breakpoint keys)
 * @param breakpoint - The current breakpoint
 * @returns The resolved value for the current breakpoint
 */
export function resolveResponsiveValue(
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
 * Process utility props and generate utility classes and styles
 * @param props - All component props
 * @param utilityPropKeys - Array of utility prop names to process
 * @returns Object with utilityClasses string and utilityStyle CSSProperties
 */
export function processUtilityProps(
  props: Record<string, any>,
  utilityPropKeys: readonly string[],
): { utilityClasses: string; utilityStyle: CSSProperties } {
  const utilityClassList: string[] = [];
  const generatedStyle: CSSProperties = {};

  const handleUtilityValue = (
    key: string,
    val: unknown,
    prefix: string = '',
  ) => {
    // Get utility class configuration for this key
    const utilityConfig = utilityClassMap[key as keyof typeof utilityClassMap];

    if (!utilityConfig) {
      // Skip if no config found for this key
      return;
    }

    // Check if value is in the list of valid values for this utility
    if (
      utilityConfig.values.length > 0 &&
      utilityConfig.values.includes(val as string | number)
    ) {
      // Generate utility class with value suffix and optional breakpoint prefix
      const className = prefix
        ? `${prefix}${utilityConfig.class}-${val}`
        : `${utilityConfig.class}-${val}`;
      utilityClassList.push(className);
    } else if (utilityConfig.cssVar) {
      // Custom value - add CSS custom property AND utility class name
      // Only if cssVar is defined (properties with fixed values don't have cssVar)
      const cssVarKey = prefix
        ? `${utilityConfig.cssVar}-${prefix.slice(0, -1)}`
        : utilityConfig.cssVar;
      // CSS custom properties need to be set on the style object as strings
      (generatedStyle as Record<string, unknown>)[cssVarKey] = val;

      // Add utility class name (without value suffix) with optional breakpoint prefix
      const className = prefix
        ? `${prefix}${utilityConfig.class}`
        : utilityConfig.class;
      utilityClassList.push(className);
    }
    // If no cssVar and value is not in valid values, skip (invalid value for fixed-value property)
  };

  for (const key of utilityPropKeys) {
    const value = props[key];
    if (value === undefined || value === null) {
      continue;
    }

    // Check if value is a responsive object
    if (typeof value === 'object' && value !== null) {
      const breakpointValues = value as { [key: string]: unknown };
      // Handle responsive object values
      for (const bp in breakpointValues) {
        const prefix = bp === 'initial' ? '' : `${bp}:`;
        handleUtilityValue(key, breakpointValues[bp], prefix);
      }
    } else {
      // Handle simple value
      handleUtilityValue(key, value);
    }
  }

  return {
    utilityClasses: utilityClassList.join(' '),
    utilityStyle: generatedStyle,
  };
}
