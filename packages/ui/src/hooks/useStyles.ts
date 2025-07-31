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
import { useMemo, useState, useEffect } from 'react';
import { breakpoints } from './useBreakpoint';
import { componentDefinitions } from '../utils/componentDefinitions';
import type { ComponentDefinitionName, ComponentClassNames } from '../types';

/**
 * Lazy breakpoint hook that only subscribes to changes when needed
 */
function useLazyBreakpoint(hasResponsiveProps: boolean) {
  const [breakpoint, setBreakpoint] = useState<string>(() => {
    if (typeof window === 'undefined') return 'initial';

    const width = window.innerWidth;
    if (width >= 1536) return 'xl';
    if (width >= 1280) return 'lg';
    if (width >= 1024) return 'md';
    if (width >= 768) return 'sm';
    if (width >= 640) return 'xs';
    return 'initial';
  });

  useEffect(() => {
    // Only set up resize listener if we have responsive props
    if (!hasResponsiveProps || typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      let newBreakpoint: string;

      if (width >= 1536) newBreakpoint = 'xl';
      else if (width >= 1280) newBreakpoint = 'lg';
      else if (width >= 1024) newBreakpoint = 'md';
      else if (width >= 768) newBreakpoint = 'sm';
      else if (width >= 640) newBreakpoint = 'xs';
      else newBreakpoint = 'initial';

      setBreakpoint(prev => (prev !== newBreakpoint ? newBreakpoint : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasResponsiveProps]);

  return breakpoint;
}

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
 * Check if a value is responsive (an object with breakpoint keys)
 */
function isResponsiveValue(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if any props contain responsive values
 */
function hasResponsiveProps(props: Record<string, any>): boolean {
  return Object.values(props).some(isResponsiveValue);
}

/**
 * Create a stable key for props to avoid unnecessary re-renders
 */
function createPropsKey(props: Record<string, any>): string {
  const entries = Object.entries(props)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      if (isResponsiveValue(value)) {
        return `${key}:${JSON.stringify(value)}`;
      }
      return `${key}:${value}`;
    });
  return entries.join('|');
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
  const classNames = componentDefinitions[componentName]
    .classNames as ComponentClassNames<T>;

  // Check if we have any responsive props
  const hasResponsive = hasResponsiveProps(props);

  // Use lazy breakpoint hook that only subscribes when needed
  const breakpoint = useLazyBreakpoint(hasResponsive);

  const { dataAttributes, resolvedProps } = useMemo(() => {
    const dataAttributes: Record<string, string> = {};
    const resolvedProps: Record<string, string> = {};

    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined && value !== null) {
        // Only do responsive resolution if we actually have responsive props
        const resolvedValue =
          hasResponsive && isResponsiveValue(value)
            ? resolveResponsiveValue(value, breakpoint)
            : value;

        if (resolvedValue !== undefined) {
          resolvedProps[key] = resolvedValue;
          dataAttributes[`data-${key}`] = resolvedValue;
        }
      }
    }

    return { dataAttributes, resolvedProps };
  }, [createPropsKey(props), hasResponsive ? breakpoint : null]);

  return {
    classNames,
    dataAttributes,
    resolvedProps,
  };
}
