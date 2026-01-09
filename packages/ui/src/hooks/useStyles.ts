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
import { useBreakpoint } from './useBreakpoint';
import type { ComponentDefinition } from '../types';
import {
  resolveResponsiveValue,
  processUtilityProps,
} from './useDefinition/helpers';

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
  dataAttributes: Record<string, string>;
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
  const { utilityClasses, utilityStyle: generatedStyle } = processUtilityProps(
    props,
    utilityPropNames,
  );

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
    dataAttributes,
    utilityClasses,
    style: mergedStyle,
    cleanedProps,
  };
}
