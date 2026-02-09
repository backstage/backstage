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

import { ReactNode } from 'react';
import clsx from 'clsx';
import { useBreakpoint } from '../useBreakpoint';
import { useBg, BgProvider } from '../useBg';
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

  const { bg: resolvedBg } = useBg(
    definition.bg ? { mode: definition.bg, bg: props.bg } : undefined,
  );

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
        // eslint-disable-next-line no-restricted-syntax
        dataAttributes[`data-${key.toLowerCase()}`] = String(finalValue);
      }
    }
  }

  // Set data-bg from the resolved bg value (works for both container and leaf)
  if (definition.bg && resolvedBg !== undefined) {
    dataAttributes['data-bg'] = String(resolvedBg);
  }

  const { utilityClasses, utilityStyle } = processUtilityProps<UtilityKeys<D>>(
    props,
    (definition.utilityProps ?? []) as readonly UtilityKeys<D>[],
  );

  const utilityTarget = options?.utilityTarget ?? 'root';
  const classNameTarget = options?.classNameTarget ?? 'root';

  const classes: Record<string, string> = {};

  for (const [name, cssKey] of Object.entries(definition.classNames)) {
    classes[name] = clsx(
      cssKey as string,
      definition.styles[cssKey as keyof typeof definition.styles],
      utilityTarget === name && utilityClasses,
      classNameTarget === name && ownPropsResolved.className,
    );
  }

  let children: ReactNode | undefined;
  let bgChildren: ReactNode | undefined;

  if (definition.bg === 'container') {
    bgChildren = resolvedBg ? (
      <BgProvider bg={resolvedBg}>{props.children}</BgProvider>
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
      ...(definition.bg === 'container' ? { bgChildren } : { children }),
    },
    restProps,
    dataAttributes,
    utilityStyle,
  } as unknown as UseDefinitionResult<D, P>;
}
