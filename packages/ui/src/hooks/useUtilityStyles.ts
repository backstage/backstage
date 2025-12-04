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

import clsx from 'clsx';
import type { ComponentDefinition } from '../types';
import { utilityClassMap } from '../utils/utilityClassMap';
import { applyDefaults } from './helpers';

type UtilityConfig = {
  class: string;
  cssVar?: `--${string}`;
  values: readonly (string | number)[];
};
//
type BUICSSProperties = React.CSSProperties & {
  [index: `--${string}`]: any;
};

function processUtilityValue(
  value: unknown,
  utilityConfig: UtilityConfig,
  prefix: string,
  utilityClassList: string[],
  style: BUICSSProperties,
): void {
  if (
    utilityConfig.values.length > 0 &&
    utilityConfig.values.includes(value as string | number)
  ) {
    const className = prefix
      ? `${prefix}${utilityConfig.class}-${value}`
      : `${utilityConfig.class}-${value}`;
    utilityClassList.push(className);
  } else if (utilityConfig.cssVar) {
    const cssVarKey: `--${string}` = prefix
      ? `${utilityConfig.cssVar}-${prefix.slice(0, -1)}`
      : utilityConfig.cssVar;
    style[cssVarKey] = value;

    const className = prefix
      ? `${prefix}${utilityConfig.class}`
      : utilityConfig.class;
    utilityClassList.push(className);
  }
}

// --- Helper types ---

type AnyProps = Record<string, any>;
type AnyStyles = Readonly<Record<string, string>>;
type AnyComponentDefinition = ComponentDefinition<AnyProps, AnyStyles>;

type StylesOf<Def> = Def extends ComponentDefinition<any, infer Styles>
  ? Styles
  : never;

type ClassNamesResult<Def extends AnyComponentDefinition> = {
  [K in keyof StylesOf<Def>]: string;
};

export interface UseUtilityStylesOptions<
  TDefinition extends AnyComponentDefinition,
> {
  /**
   * Which className key to merge the utility classes into.
   *
   * - Defaults to 'root'
   */
  mergeUtilityClassesInto?: keyof StylesOf<TDefinition>;
}

function utilityStylesImpl(
  definition: AnyComponentDefinition,
  props: AnyProps,
  baseClassNames: Record<string, string>,
  mergeInto: string,
): UtilityStylesBase {
  const { utilityProps } = definition;
  if (!utilityProps?.length) {
    // No utilities defined -> nothing to merge
    return undefined;
  }

  const utilityKeys = utilityProps as ReadonlyArray<string>;
  const utilityClassList: string[] = [];
  const style: BUICSSProperties = {};
  const propsWithDefaults = applyDefaults(definition, props);

  for (const key of utilityKeys) {
    const value = propsWithDefaults[key];

    if (value === undefined || value === null) continue;

    const utilityConfig = utilityClassMap[key];
    if (!utilityConfig) continue;

    // Check if value is a responsive object
    if (typeof value === 'object' && value !== null) {
      const breakpointValues = value as { [key: string]: unknown };
      for (const bp in breakpointValues) {
        const prefix = bp === 'initial' ? '' : `${bp}:`;
        processUtilityValue(
          breakpointValues[bp],
          utilityConfig,
          prefix,
          utilityClassList,
          style,
        );
      }
    } else {
      processUtilityValue(value, utilityConfig, '', utilityClassList, style);
    }
  }

  const utilityClassName = clsx(utilityClassList);

  const mergedStyles: BUICSSProperties = {
    ...style,
    ...(props.style || {}),
  };

  // Merge utilityClassName into the chosen slot of baseClassNames
  let classNames: Record<string, string> = baseClassNames;

  if (!(mergeInto in baseClassNames)) {
    throw new Error(
      `useUtilityStyles: Invalid mergeInto key. Key '${mergeInto}' does not match available classNames: ${Object.keys(
        definition.classNames,
      )}.`,
    );
  }

  if (utilityClassName && mergeInto !== null) {
    classNames = {
      ...baseClassNames,
      [mergeInto]: clsx(baseClassNames[mergeInto] ?? '', utilityClassName),
    };
  }

  return {
    classNames,
    style: mergedStyles,
  };
}

export type UtilityStylesResult<Def extends AnyComponentDefinition> =
  Def extends { utilityProps: readonly (keyof any)[] }
    ? {
        classNames: ClassNamesResult<Def>;
        style: BUICSSProperties;
      }
    : undefined;

export type UtilityStylesBase =
  | undefined
  | {
      classNames: Record<string, string>;
      style: BUICSSProperties;
    };

export function useUtilityStyles<
  Def extends AnyComponentDefinition,
  All extends AnyProps,
>(
  definition: Def,
  props: All,
  baseClassNames: ClassNamesResult<Def>,
  options: UseUtilityStylesOptions<Def>,
): UtilityStylesResult<Def> {
  const mergeInto = (options.mergeUtilityClassesInto as string) ?? 'root';

  const impl = utilityStylesImpl(
    definition as AnyComponentDefinition,
    props as AnyProps,
    baseClassNames as Record<string, string>,
    mergeInto,
  );

  return impl as UtilityStylesResult<Def>;
}
