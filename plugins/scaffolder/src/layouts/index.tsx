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
import type { LayoutOptions } from './types';

export const LAYOUTS_KEY = 'scaffolder.layout.v1';
export const LAYOUTS_WRAPPER_KEY = 'scaffolder.layouts.wrapper.v1';

/**
 * The type used to wrap up the Layout and embed the input props
 *
 * @public
 */
export type LayoutComponent<_TInputProps> = () => null;

/**
 * Method for creating custom Layouts that can be used in the scaffolder frontend form
 *
 * @public
 */
export function createScaffolderLayout<TInputProps = unknown>(
  options: LayoutOptions,
): Extension<LayoutComponent<TInputProps>> {
  return {
    expose() {
      const LayoutDataHolder: any = () => null;

      attachComponentData(LayoutDataHolder, LAYOUTS_KEY, options);

      return LayoutDataHolder;
    },
  };
}

/**
 * The wrapping component for defining scaffolder layouts as children
 *
 * @public
 */
export const ScaffolderLayouts: React.ComponentType = (): JSX.Element | null =>
  null;

attachComponentData(ScaffolderLayouts, LAYOUTS_WRAPPER_KEY, true);

export type { LayoutOptions, LayoutTemplate } from './types';
