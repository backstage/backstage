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
import type { ComponentDefinition } from '../types';
import {
  useComponentProps,
  type ComponentPropsResult,
} from './useComponentProps';
import {
  useDataAttributes,
  type DataAttributesResult,
} from './useDataAttributes';
import {
  useUtilityStyles,
  UtilityStylesBase,
  type UseUtilityStylesOptions,
} from './useUtilityStyles';
import { useClassNames, type UseClassNamesOptions } from './useClassNames';

// --- Helper types ---
type BUICSSProperties = React.CSSProperties & {
  [index: `--${string}`]: any;
};

type AnyProps = Record<string, any>;
type AnyStyles = Readonly<Record<string, string>>;
type AnyComponentDefinition = ComponentDefinition<AnyProps, AnyStyles>;

type StylesOf<Def> = Def extends ComponentDefinition<any, infer Styles>
  ? Styles
  : never;

// --- Result composition types ---

type ComponentPropsForDef<
  Def extends AnyComponentDefinition,
  All extends AnyProps,
> = ComponentPropsResult<Def, All>;

type ClassNamesResult<Def extends AnyComponentDefinition> = {
  [K in keyof StylesOf<Def>]: string;
};

type DataAttributesMixin<Def extends AnyComponentDefinition> =
  DataAttributesResult<Def> extends undefined
    ? {}
    : { dataAttributes: DataAttributesResult<Def> };

type UtilityStylesMixin<Def extends AnyComponentDefinition> = Def extends {
  utilityProps: readonly (keyof any)[];
}
  ? { style: BUICSSProperties }
  : {};

export type ComponentDefinitionResult<
  Def extends AnyComponentDefinition,
  All extends AnyProps,
> = {
  classNames: ClassNamesResult<Def>;
} & ComponentPropsForDef<Def, All> &
  DataAttributesMixin<Def> &
  UtilityStylesMixin<Def>;

// --- Options for this hook ---

export type UseComponentDefinitionOptions<Def extends AnyComponentDefinition> =
  UseClassNamesOptions<Def> & UseUtilityStylesOptions<Def>;

// --- Hook ---

export function useComponentDefinition<
  Def extends AnyComponentDefinition,
  All extends AnyProps,
>(
  definition: Def,
  styles: Readonly<Record<string, string>>,
  props: All,
  options: UseComponentDefinitionOptions<Def> = {},
): ComponentDefinitionResult<Def, All> {
  const { mergeClassNameInto, mergeUtilityClassesInto } = options;

  // 1. Split own vs inherited props (RA-aware, based on All)
  const propsResult = useComponentProps(definition, props);

  // 2. Base classNames: CSS modules + prop.className
  const baseClassNames = useClassNames(definition, styles, props, {
    mergeClassNameInto,
  });

  // 3. Utility: merge utility classes into classNames + get utility style (or undefined) + props without utility props
  const utilRuntime = useUtilityStyles(
    definition,
    propsResult.ownProps,
    baseClassNames,
    {
      mergeUtilityClassesInto,
    },
  ) as UtilityStylesBase;

  const classNames: ClassNamesResult<Def> = utilRuntime
    ? (utilRuntime.classNames as ClassNamesResult<Def>)
    : baseClassNames;

  // 4. Data attributes
  const dataAttrs = useDataAttributes(definition, props);

  const result = {
    classNames,
    ...propsResult,
    dataAttributes: dataAttrs as DataAttributesResult<Def>,
    ...(utilRuntime
      ? ({
          style: utilRuntime.style,
        } as UtilityStylesMixin<Def>)
      : ({} as UtilityStylesMixin<Def>)),
  } satisfies ComponentDefinitionResult<Def, All>;

  return result;
}
