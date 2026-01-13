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

import { useMemo, ReactNode } from 'react';
import clsx from 'clsx';
import { useBreakpoint } from '../useBreakpoint';
import { useSurface, SurfaceProvider, UseSurfaceOptions } from '../useSurface';
import { resolveResponsiveValue, processUtilityProps } from './helpers';
import type {
  ComponentConfig,
  UseDefinitionOptions,
  UseDefinitionResult,
  UtilityKeys,
} from './types';

export function useDefinition<
  D extends ComponentConfig<any, any>,
  P extends Record<string, any>,
>(
  definition: D,
  props: P,
  options?: UseDefinitionOptions<D>,
): UseDefinitionResult<D, P> {
  const { breakpoint } = useBreakpoint();

  const surfaceOptions: UseSurfaceOptions | undefined =
    definition.surface === 'container'
      ? { surface: props.surface }
      : definition.surface === 'leaf'
      ? { onSurface: props.onSurface }
      : undefined;

  const { surface: resolvedSurface } = useSurface(surfaceOptions);

  return useMemo(() => {
    const ownPropKeys = new Set(Object.keys(definition.propDefs));
    const utilityPropKeys = new Set(definition.utilityProps ?? []);

    const ownPropsRaw: Record<string, any> = {};
    const restProps: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      if (ownPropKeys.has(key)) {
        ownPropsRaw[key] = value;
      } else if (!(utilityPropKeys as Set<string>).has(key)) {
        restProps[key] = value;
      }
    }

    const ownPropsResolved: Record<string, any> = {};
    const dataAttributes: Record<string, string | undefined> = {};

    for (const [key, config] of Object.entries(definition.propDefs)) {
      const rawValue = ownPropsRaw[key];
      const resolvedValue = resolveResponsiveValue(rawValue, breakpoint);
      const finalValue = resolvedValue ?? (config as any).default;

      if (finalValue !== undefined) {
        ownPropsResolved[key] = finalValue;

        if ((config as any).dataAttribute) {
          dataAttributes[`data-${key}`] = String(finalValue);
        }
      }
    }

    // Add data-on-surface for leaf components
    if (definition.surface === 'leaf' && resolvedSurface !== undefined) {
      // Handle responsive surface values - for data attributes, use the resolved string
      const surfaceValue =
        typeof resolvedSurface === 'object'
          ? resolveResponsiveValue(resolvedSurface as any, breakpoint)
          : resolvedSurface;
      if (surfaceValue !== undefined) {
        dataAttributes['data-on-surface'] = String(surfaceValue);
      }
    }

    const { utilityClasses, utilityStyle } = processUtilityProps<
      UtilityKeys<D>
    >(props, (definition.utilityProps ?? []) as readonly UtilityKeys<D>[]);

    const utilityTarget = options?.utilityTarget ?? 'root';
    const classNameTarget = options?.classNameTarget ?? 'root';

    const classes: Record<string, string> = {};

    for (const [name, cssKey] of Object.entries(definition.classNames)) {
      classes[name] = clsx(
        cssKey as string,
        definition.styles[cssKey as keyof typeof definition.styles],
        {
          [utilityClasses]: utilityTarget === name,
          [ownPropsResolved.className]: classNameTarget === name,
        },
      );
    }

    let children: ReactNode | undefined;
    let surfaceChildren: ReactNode | undefined;

    if (definition.surface === 'container') {
      surfaceChildren = resolvedSurface ? (
        <SurfaceProvider surface={resolvedSurface}>
          {props.children}
        </SurfaceProvider>
      ) : (
        props.children
      );
    } else {
      children = props.children;
    }

    return {
      ownProps: {
        classes,
        ...ownPropsResolved,
        ...(definition.surface === 'container'
          ? { surfaceChildren }
          : { children }),
      },
      restProps,
      dataAttributes,
      utilityStyle,
    } as unknown as UseDefinitionResult<D, P>;
  }, [definition, props, breakpoint, resolvedSurface, options]);
}
