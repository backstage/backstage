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

// Valid spacing values that have predefined utility classes
const VALID_SPACING_VALUES = [
  '0.5',
  '1',
  '1.5',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
] as const;

const utilityClassMap = {
  m: {
    class: 'bui-m',
    cssVar: '--m',
    values: VALID_SPACING_VALUES,
  },
  mb: {
    class: 'bui-mb',
    cssVar: '--mb',
    values: VALID_SPACING_VALUES,
  },
  ml: {
    class: 'bui-ml',
    cssVar: '--ml',
    values: VALID_SPACING_VALUES,
  },
  mr: {
    class: 'bui-mr',
    cssVar: '--mr',
    values: VALID_SPACING_VALUES,
  },
  mt: {
    class: 'bui-mt',
    cssVar: '--mt',
    values: VALID_SPACING_VALUES,
  },
  mx: {
    class: 'bui-mx',
    cssVar: '--mx',
    values: VALID_SPACING_VALUES,
  },
  my: {
    class: 'bui-my',
    cssVar: '--my',
    values: VALID_SPACING_VALUES,
  },
  p: {
    class: 'bui-p',
    cssVar: '--p',
    values: VALID_SPACING_VALUES,
  },
  pb: {
    class: 'bui-pb',
    cssVar: '--pb',
    values: VALID_SPACING_VALUES,
  },
  pl: {
    class: 'bui-pl',
    cssVar: '--pl',
    values: VALID_SPACING_VALUES,
  },
  pr: {
    class: 'bui-pr',
    cssVar: '--pr',
    values: VALID_SPACING_VALUES,
  },
  pt: {
    class: 'bui-pt',
    cssVar: '--pt',
    values: VALID_SPACING_VALUES,
  },
  px: {
    class: 'bui-px',
    cssVar: '--px',
    values: VALID_SPACING_VALUES,
  },
  py: {
    class: 'bui-py',
    cssVar: '--py',
    values: VALID_SPACING_VALUES,
  },
  width: {
    class: 'bui-w',
    cssVar: '--width',
    values: VALID_SPACING_VALUES,
  },
  minWidth: {
    class: 'bui-min-w',
    cssVar: '--min-width',
    values: VALID_SPACING_VALUES,
  },
  maxWidth: {
    class: 'bui-max-w',
    cssVar: '--max-width',
    values: VALID_SPACING_VALUES,
  },
  height: {
    class: 'bui-h',
    cssVar: '--height',
    values: VALID_SPACING_VALUES,
  },
  minHeight: {
    class: 'bui-min-h',
    cssVar: '--min-height',
    values: VALID_SPACING_VALUES,
  },
  maxHeight: {
    class: 'bui-max-h',
    cssVar: '--max-height',
    values: VALID_SPACING_VALUES,
  },
  position: {
    class: 'bui-position',
    cssVar: '--position',
    values: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  },
  display: {
    class: 'bui-display',
    cssVar: '--display',
    values: ['none', 'flex', 'block', 'inline'],
  },
};

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
 * @param props - All component props
 * @returns Object with classNames, dataAttributes, utilityClasses, style, and cleanedProps
 */
export function useStyles<T extends ComponentDefinitionName>(
  componentName: T,
  props: Record<string, any> = {},
): {
  classNames: ComponentClassNames<T>;
  dataAttributes: Record<string, string>;
  utilityClasses: string;
  style: React.CSSProperties;
  cleanedProps: Record<string, any>;
} {
  const { breakpoint } = useBreakpoint();
  const componentDefinition = componentDefinitions[componentName];
  const classNames = componentDefinition.classNames as ComponentClassNames<T>;
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
      const resolvedValue = resolveResponsiveValue(value, breakpoint);
      if (resolvedValue !== undefined) {
        dataAttributes[`data-${key}`] = resolvedValue;
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
    if (utilityConfig.values.includes(val as any)) {
      // Generate utility class with value suffix and optional breakpoint prefix
      const className = prefix
        ? `${prefix}${utilityConfig.class}-${val}`
        : `${utilityConfig.class}-${val}`;
      utilityClassList.push(className);
    } else {
      // Custom value - add CSS custom property AND utility class name
      const cssVarKey = prefix
        ? `${utilityConfig.cssVar}-${prefix.slice(0, -1)}`
        : utilityConfig.cssVar;
      // CSS custom properties need to be set as any since they're not part of CSSProperties
      (generatedStyle as any)[cssVarKey] = val;

      // Add utility class name (without value suffix) with optional breakpoint prefix
      const className = prefix
        ? `${prefix}${utilityConfig.class}`
        : utilityConfig.class;
      utilityClassList.push(className);
    }
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

  // Create cleaned props by excluding data attributes, utility props, and style
  // Component-specific props like 'as' and 'children' remain in cleanedProps
  const processedKeys = new Set([
    ...dataAttributeNames,
    ...utilityPropNames,
    'style',
  ]);

  const cleanedProps = Object.keys(props).reduce((acc, key) => {
    if (!processedKeys.has(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {} as Record<string, any>);

  // Merge incoming style with generated styles (incoming styles take precedence)
  const mergedStyle = {
    ...generatedStyle,
    ...incomingStyle,
  };

  return {
    classNames,
    dataAttributes,
    utilityClasses: utilityClassList.join(' '),
    style: mergedStyle,
    cleanedProps,
  };
}
