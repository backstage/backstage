import { LayoutOptions } from '../types';
import { LAYOUTS_KEY, LAYOUTS_WRAPPER_KEY } from './keys';

/*
 * Copyright 2023 The Backstage Authors
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

/**
 * A type used to wrap up the FieldExtension to embed the ReturnValue and the InputProps
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
