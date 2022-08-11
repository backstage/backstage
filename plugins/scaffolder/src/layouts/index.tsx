/*
 * Copyright 2022 The Backstage Authors
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

import { attachComponentData, Extension } from '@backstage/core-plugin-api';
import { UiSchema } from '@rjsf/core';
import { DEFAULT_SCAFFOLDER_LAYOUT } from './default';
import type { LayoutOptions, ObjectFieldTemplate } from './types';

export const LAYOUTS_KEY = 'scaffolder.layout.v1';
export const LAYOUTS_WRAPPER_KEY = 'scaffolder.layouts.wrapper.v1';

export type LayoutComponent<_TReturnValue, _TInputProps> = () => null;

export function createScaffolderLayout<
  TFieldReturnValue = unknown,
  TInputProps = unknown,
>(
  options: LayoutOptions,
): Extension<LayoutComponent<TFieldReturnValue, TInputProps>> {
  return {
    expose() {
      const LayoutDataHolder: any = () => null;

      attachComponentData(LayoutDataHolder, LAYOUTS_KEY, options);

      return LayoutDataHolder;
    },
  };
}

export const ScaffolderLayouts: React.ComponentType = (): JSX.Element | null =>
  null;

attachComponentData(ScaffolderLayouts, LAYOUTS_WRAPPER_KEY, true);

export type { LayoutOptions, ObjectFieldTemplate } from './types';

export { DEFAULT_SCAFFOLDER_LAYOUT } from './default';

export function resolveStepLayout(
  uiSchema: UiSchema = {},
  layouts: LayoutOptions[],
): ObjectFieldTemplate {
  const layoutName =
    uiSchema?.['ui:ObjectFieldTemplate'] ?? DEFAULT_SCAFFOLDER_LAYOUT.name;

  delete uiSchema?.['ui:ObjectFieldTemplate'];

  const LayoutComponent = layouts.find(
    layout => layout.name === layoutName,
  )?.component;

  if (!LayoutComponent) {
    throw new Error(`no step layout found for ${layoutName}`);
  }

  return LayoutComponent;
}
