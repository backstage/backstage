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

type StylesOf<Def> = Def extends ComponentDefinition<any, infer Styles>
  ? Styles
  : never;

export interface UseClassNamesOptions<
  TDefinition extends ComponentDefinition<any, any>,
> {
  /**
   * Which className to merge the prop className into
   * - Defaults to 'root'
   * - Set to null to not merge (component handles manually)
   */
  mergeClassNameInto?: keyof StylesOf<TDefinition> | null;
}

/**
 * Merge component CSS classes with CSS modules and prop className
 *
 * @param definition - Component definition with classNames
 * @param styles - CSS module styles object
 * @param props - Component props (only uses className)
 * @param options - Configuration options
 * @returns Object with merged classNames
 *
 * @public
 */
export function useClassNames<
  TDefinition extends ComponentDefinition<any, any>,
>(
  definition: TDefinition,
  styles: Readonly<Record<string, string>>,
  props: { className?: string },
  options: UseClassNamesOptions<TDefinition> = {},
): { [K in keyof StylesOf<TDefinition>]: string } {
  const { mergeClassNameInto: mergeInto = 'root' } = options;

  const classNames = definition.classNames as StylesOf<TDefinition>;

  type Result = { [K in keyof StylesOf<TDefinition>]: string };
  const result: Partial<Result> = {};

  (Object.keys(classNames) as Array<keyof StylesOf<TDefinition>>).forEach(
    key => {
      const baseClass = classNames[key];
      const moduleClass = styles[baseClass];

      const shouldMergeClassName = mergeInto !== null && mergeInto === key;

      result[key] = shouldMergeClassName
        ? clsx(baseClass, moduleClass, props.className)
        : clsx(baseClass, moduleClass);
    },
  );

  return result as Result;
}
