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

export function createScaffolderFieldExtension<
  TReturnValue = unknown,
  TInputProps = unknown,
>(
  options: FieldExtensionOptions<TReturnValue, TInputProps>,
  // TODO: need know how to embed these types nicely so the api report looks nice.
  // then we can remove the export of the components
): Extension<() => null> {
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

export const ScaffolderFieldExtensions: React.ComponentType = () => null;
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
