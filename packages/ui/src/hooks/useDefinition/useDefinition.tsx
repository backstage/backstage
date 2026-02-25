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
import { resolveDefinitionProps, processUtilityProps } from './helpers';
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

  // Resolve all props centrally — applies responsive values and defaults
  const { ownPropsResolved, restProps } = resolveDefinitionProps(
    definition,
    props,
    breakpoint,
  );

  const dataAttributes: Record<string, string | undefined> = {};

  for (const [key, config] of Object.entries(definition.propDefs)) {
    const finalValue = ownPropsResolved[key];

    if (finalValue !== undefined) {
      // Skip data-bg for bg prop when the provider path handles it
      if (key === 'bg' && definition.bg === 'provider') continue;

      if ((config as any).dataAttribute) {
        // eslint-disable-next-line no-restricted-syntax
        dataAttributes[`data-${key.toLowerCase()}`] = String(finalValue);
      }
    }
  }

  // Provider: resolve bg and provide context for children
  const providerBg = useBgProvider(
    definition.bg === 'provider' ? ownPropsResolved.bg : undefined,
  );

  // Consumer: read parent context bg
  const consumerBg = useBgConsumer();

  // Provider: set data-bg from the resolved provider bg
  if (definition.bg === 'provider' && providerBg.bg !== undefined) {
    dataAttributes['data-bg'] = String(providerBg.bg);
  }

  // Consumer: set data-on-bg from the parent context
  if (definition.bg === 'consumer' && consumerBg.bg !== undefined) {
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
  let childrenWithBgProvider: ReactNode | undefined;

  if (definition.bg === 'provider') {
    childrenWithBgProvider = providerBg.bg ? (
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
      ...(definition.bg === 'provider'
        ? { childrenWithBgProvider }
        : { children }),
    },
    restProps,
    dataAttributes,
    utilityStyle,
  } as unknown as UseDefinitionResult<D, P>;
}
