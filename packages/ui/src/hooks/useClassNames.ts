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

interface UseClassNamesOptions<
  TDefinition extends ComponentDefinition<any, any>,
> {
  /**
   * Which className to merge the prop className into
   * - Defaults to 'root'
   * - Set to null to not merge (component handles manually)
   */
  mergeInto?: keyof TDefinition['classNames'] | null;
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
  styles: Readonly<{ [key: string]: string }>,
  props: { className?: string },
  options: UseClassNamesOptions<TDefinition> = {},
): Record<keyof TDefinition['classNames'], string> {
  const { mergeInto = 'root' } = options;

  const classNames = definition.classNames;

  const result: Record<keyof typeof classNames, string> = {};

  // Process each className
  (Object.keys(classNames) as Array<keyof typeof classNames>).forEach(key => {
    const baseClass = classNames[key];
    const moduleClass = styles[baseClass];

    // Merge prop className only into the specified element
    const shouldMergeClassName = mergeInto !== null && mergeInto === key;

    result[key] = shouldMergeClassName
      ? clsx(baseClass, moduleClass, props.className)
      : clsx(baseClass, moduleClass);
  });

  return result;
}
