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

import { breakpoints } from '../useBreakpoint';
import { utilityClassMap } from '../../utils/utilityClassMap';
import type { UnwrapResponsive, UtilityStyle } from './types';

const namedBreakpoints = breakpoints.filter(b => b.id !== 'initial');

function isResponsiveObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    namedBreakpoints.some(b => b.id in value)
  );
}

export function resolveResponsiveValue<T>(
  value: T,
  breakpoint: string,
): UnwrapResponsive<T> {
  if (!isResponsiveObject(value)) {
    return value as UnwrapResponsive<T>;
  }

  const index = breakpoints.findIndex(b => b.id === breakpoint);

  // Look for value at current breakpoint or smaller
  for (let i = index; i >= 0; i--) {
    const key = breakpoints[i].id;
    if (key in value && value[key] !== undefined) {
      return value[key] as UnwrapResponsive<T>;
    }
  }

  // If no value found, check from smallest breakpoint up
  for (let i = 0; i < breakpoints.length; i++) {
    const key = breakpoints[i].id;
    if (key in value && value[key] !== undefined) {
      return value[key] as UnwrapResponsive<T>;
    }
  }

  return value as UnwrapResponsive<T>;
}

export function processUtilityProps<Keys extends string>(
  props: Record<string, any>,
  utilityPropKeys: readonly Keys[],
): { utilityClasses: string; utilityStyle: UtilityStyle<Keys> } {
  const utilityClassList: string[] = [];
  const generatedStyle: Record<string, unknown> = {};

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
    const values = utilityConfig.values as readonly (string | number)[];
    if (values.length > 0 && values.includes(val as string | number)) {
      // Generate utility class with value suffix and optional breakpoint prefix
      const className = prefix
        ? `${prefix}${utilityConfig.class}-${val}`
        : `${utilityConfig.class}-${val}`;
      utilityClassList.push(className);
    } else if ('cssVar' in utilityConfig && utilityConfig.cssVar) {
      // Custom value - add CSS custom property AND utility class name
      // Only if cssVar is defined (properties with fixed values don't have cssVar)
      const cssVar = utilityConfig.cssVar;
      const cssVarKey = prefix ? `${cssVar}-${prefix.slice(0, -1)}` : cssVar;
      // CSS custom properties need to be set on the style object
      generatedStyle[cssVarKey] = val;

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
    utilityStyle: generatedStyle as UtilityStyle<Keys>,
  };
}
