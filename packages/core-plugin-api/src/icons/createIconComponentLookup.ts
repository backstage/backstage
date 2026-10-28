/*
 * Copyright 2026 The Backstage Authors
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

import type {
  IconComponent,
  IconElement,
} from '@backstage/frontend-plugin-api';
import { cloneElement } from 'react';

const legacyFontSizeMap = {
  inherit: 'inherit',
  small: '1.25rem',
  medium: '1.5rem',
  large: '2.1875rem',
} as const;

/**
 * Provides stable icon components for legacy app contexts from element lookups.
 * @internal
 */
export function createIconComponentLookup(
  lookup: (key: string) => IconElement | undefined,
): (key: string) => IconComponent | undefined {
  const components = new Map<string, IconComponent>();
  return key => {
    let component = components.get(key);
    if (component) {
      return component;
    }
    const el = lookup(key);
    if (el === undefined) {
      return undefined;
    }
    component = props => {
      if (el === null) {
        return null;
      }

      const {
        fontSize = 'medium',
        className,
        style,
        ...rest
      } = props as {
        fontSize?: keyof typeof legacyFontSizeMap;
        className?: string;
        style?: Record<string, unknown>;
      } & Record<string, unknown>;

      const elementProps = el.props as {
        className?: string;
        style?: Record<string, unknown>;
      };

      return cloneElement(el, {
        ...rest,
        className:
          [elementProps.className, className].filter(Boolean).join(' ') ||
          undefined,
        style: {
          ...elementProps.style,
          fontSize: legacyFontSizeMap[fontSize],
          ...style,
        },
      });
    };
    components.set(key, component);
    return component;
  };
}
