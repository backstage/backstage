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

import { LAYOUTS_KEY, LAYOUTS_WRAPPER_KEY } from './keys';
import { attachComponentData, Extension } from '@backstage/core-plugin-api';
import type { FormProps as SchemaFormProps } from '@rjsf/core';
import React from 'react';

/**
 * The field template from `@rjsf/core` which is a react component that gets passed `@rjsf/core` field related props.
 *
 * @public
 */
export type LayoutTemplate<T = any> = NonNullable<
  SchemaFormProps<T>['uiSchema']
>['ui:ObjectFieldTemplate'];

/**
 * The type of layouts that is passed to the TemplateForms
 *
 * @public
 */
export interface LayoutOptions<P = any> {
  name: string;
  component: LayoutTemplate<P>;
}

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
export const ScaffolderLayouts: React.ComponentType<
  React.PropsWithChildren<{}>
> = (): JSX.Element | null => null;

attachComponentData(ScaffolderLayouts, LAYOUTS_WRAPPER_KEY, true);
