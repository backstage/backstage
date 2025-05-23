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

type BasePropDef = {
  type: string;
  values?: readonly unknown[];
  default?: unknown;
  required?: boolean;
  className?: string;
  responsive?: true;
  customProperties?: string[];
};

export function extractProps(
  props: {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
    [key: string]: any;
  },
  propDefs: { [name in string]: BasePropDef },
) {
  let className: string[] = (props.className || '').split(' ');
  let style: React.CSSProperties = { ...props.style };

  for (const key in propDefs) {
    const propDef = propDefs[key];

    // Check if the prop is present or has a default value
    if (!Object.hasOwn(props, key) && !propDef.hasOwnProperty('default')) {
      continue; // Skip processing if neither is present
    }

    const value = Object.hasOwn(props, key)
      ? (props[key] as unknown)
      : propDefs[key].default;
    const propDefsValues = propDef.values;
    const propDefsCustomProperties = propDef.customProperties;
    const propDefsClassName = propDef.className;
    const isResponsive = propDef.responsive;

    const handleValue = (val: unknown, prefix: string = '') => {
      // Skip adding class name if the key is "as"
      if (key === 'as') return;

      if (propDefsValues?.includes(val)) {
        className.push(`${prefix}${propDefsClassName}-${val}`);
      } else {
        if (propDefsCustomProperties) {
          for (const customProperty of propDefsCustomProperties) {
            const customPropertyKey =
              isResponsive && prefix
                ? `${customProperty}-${prefix.slice(0, -1)}`
                : customProperty;
            style[customPropertyKey as keyof typeof style] = val as any;
          }
        }
        className.push(`${prefix}${propDefsClassName}`);
      }
    };

    if (isResponsive && typeof value === 'object' && value !== null) {
      const breakpointValues = value as { [key: string]: unknown };
      // Handle responsive object values
      for (const breakpoint in breakpointValues) {
        const prefix = breakpoint === 'initial' ? '' : `${breakpoint}:`;
        handleValue(breakpointValues[breakpoint], prefix);
      }
    } else {
      handleValue(value);
    }
  }

  // Ensure keys from props that are defined in propDefs are removed
  const cleanedProps = Object.keys(props).reduce((acc, key) => {
    if (!propDefs.hasOwnProperty(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {} as { [key: string]: any });

  const newClassNames = className
    .filter(name => name && name.trim() !== '')
    .join(' ');

  return { ...cleanedProps, className: newClassNames, style };
}
