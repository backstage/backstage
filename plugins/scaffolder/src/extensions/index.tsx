/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import {
  CustomFieldValidator,
  FieldExtensionOptions,
  FieldExtensionComponentProps,
} from './types';
import { Extension, attachComponentData } from '@backstage/core-plugin-api';

export const FIELD_EXTENSION_WRAPPER_KEY = 'scaffolder.extensions.wrapper.v1';
export const FIELD_EXTENSION_KEY = 'scaffolder.extensions.field.v1';

/**
 * A type used to wrap up the FieldExtension to embed the ReturnValue and the InputProps
 *
 * @public
 */
export type FieldExtensionComponent<_TReturnValue, _TInputProps> = () => null;

/**
 * Method for creating field extensions that can be used in the scaffolder
 * frontend form.
 * @public
 */
export function createScaffolderFieldExtension<
  TReturnValue = unknown,
  TInputProps = unknown,
>(
  options: FieldExtensionOptions<TReturnValue, TInputProps>,
): Extension<FieldExtensionComponent<TReturnValue, TInputProps>> {
  return {
    expose() {
      const FieldExtensionDataHolder: any = () => null;

      attachComponentData(
        FieldExtensionDataHolder,
        FIELD_EXTENSION_KEY,
        options,
      );

      return FieldExtensionDataHolder;
    },
  };
}

/**
 * The Wrapping component for defining fields extensions inside
 *
 * @public
 */
export const ScaffolderFieldExtensions: React.ComponentType =
  (): JSX.Element | null => null;

attachComponentData(
  ScaffolderFieldExtensions,
  FIELD_EXTENSION_WRAPPER_KEY,
  true,
);

export type {
  CustomFieldValidator,
  FieldExtensionOptions,
  FieldExtensionComponentProps,
};

export { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from './default';
