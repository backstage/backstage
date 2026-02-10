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
import { useBgProvider, useBgConsumer, BgProvider } from '../useBg';
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

  // Resolve the effective bg value: use the bg prop if provided,
  // otherwise fall back to the defaultBg from the bg config
  const effectiveBg = definition.bg?.provider
    ? props.bg ?? definition.bg.defaultBg
    : undefined;

  // Provider: resolve bg and provide context for children
  const providerBg = useBgProvider(effectiveBg);

  // Consumer: read parent context bg
  const consumerBg = useBgConsumer();

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

      // Skip data-bg for bg prop when the provider path handles it
      if (key === 'bg' && definition.bg?.provider) continue;

      if ((config as any).dataAttribute) {
        // eslint-disable-next-line no-restricted-syntax
        dataAttributes[`data-${key.toLowerCase()}`] = String(finalValue);
      }
    }
  }

  // Provider-only: set data-bg (provider+consumer components use data-on-bg instead)
  if (
    definition.bg?.provider &&
    !definition.bg?.consumer &&
    providerBg.bg !== undefined
  ) {
    dataAttributes['data-bg'] = String(providerBg.bg);
  }

  // Consumer: set data-on-bg from the parent context
  if (definition.bg?.consumer && consumerBg.bg !== undefined) {
    dataAttributes['data-on-bg'] = String(consumerBg.bg);
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

  if (definition.bg?.provider) {
    bgChildren = providerBg.bg ? (
      <BgProvider bg={providerBg.bg}>{props.children}</BgProvider>
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
      ...(definition.bg?.provider ? { bgChildren } : { children }),
    },
    restProps,
    dataAttributes,
    utilityStyle,
  } as unknown as UseDefinitionResult<D, P>;
}
