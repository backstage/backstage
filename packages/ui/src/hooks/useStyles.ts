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
import { utilityClassMap } from '../utils/utilityClassMap';

type DataAttributeValue<V> = V extends string ? V : string;

type DataAttributesOf<T extends ComponentDefinition> = T extends {
  dataAttributes: infer D extends Record<string, readonly unknown[]>;
}
  ? {
      [K in keyof D as `data-${K & string}`]?: DataAttributeValue<D[K][number]>;
    }
  : Record<string, string>;

/**
 * Resolve a responsive value based on the current breakpoint
 * @param value - The responsive value (string or object with breakpoint keys)
 * @param breakpoint - The current breakpoint
 * @returns The resolved value for the current breakpoint
 */
function resolveResponsiveValue<T extends string>(
  value: T | Partial<Record<string, T>> | undefined,
  breakpoint: string,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }
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
 * @param componentDefinition - The component's definition object
 * @param props - All component props
 * @returns Object with classNames, dataAttributes, utilityClasses, style, and cleanedProps
 */
export function useStyles<
  T extends ComponentDefinition,
  P extends Record<string, any> = Record<string, any>,
>(
  componentDefinition: T,
  props: P = {} as P,
): {
  classNames: T['classNames'];
  dataAttributes: DataAttributesOf<T> & Record<string, string>;
  utilityClasses: string;
  style: React.CSSProperties;
  cleanedProps: P;
} {
  const { breakpoint } = useBreakpoint();
  const classNames = componentDefinition.classNames;
  const utilityPropNames =
    ('utilityProps' in componentDefinition
      ? componentDefinition.utilityProps
      : []) || [];

  // Extract data attribute names from component definition
  const dataAttributeNames =
    'dataAttributes' in componentDefinition
      ? Object.keys(componentDefinition.dataAttributes || {})
      : [];

  // Extract existing style from props
  const incomingStyle = props.style || {};

  // Generate data attributes from component definition
  // Keep this writable without running into TS2862 ("generic and can only be indexed for reading")
  const dataAttributes: Record<string, string> = {};
  for (const key of dataAttributeNames) {
    const value = props[key];
    if (value !== undefined && value !== null) {
      // Handle boolean and number values directly
      if (typeof value === 'boolean' || typeof value === 'number') {
        dataAttributes[`data-${key}`] = String(value);
      } else {
        const resolvedValue = resolveResponsiveValue(value, breakpoint);
        if (resolvedValue !== undefined) {
          dataAttributes[`data-${key}`] = resolvedValue;
        }
      }
    }
  }

  // Generate utility classes and custom styles from component's allowed utility props
  const utilityClassList: string[] = [];
  const generatedStyle: React.CSSProperties = {};

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

  for (const key of utilityPropNames) {
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

  // Create cleaned props by excluding only utility props
  // All other props (including data attributes, style, children, etc.) remain
  const utilityPropsSet = new Set<string>(utilityPropNames);

  const cleanedPropsBase = Object.keys(props).reduce((acc, key) => {
    if (!utilityPropsSet.has(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {} as any);

  // Merge incoming style with generated styles (incoming styles take precedence)
  const mergedStyle = {
    ...generatedStyle,
    ...incomingStyle,
  };

  // Add merged style to cleanedProps
  const cleanedProps = {
    ...cleanedPropsBase,
    style: mergedStyle,
  } as P;

  return {
    classNames,
    dataAttributes: dataAttributes as DataAttributesOf<T> &
      Record<string, string>,
    utilityClasses: utilityClassList.join(' '),
    style: mergedStyle,
    cleanedProps,
  };
}
