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

import {
  NextCustomFieldValidator,
  NextFieldExtensionOptions,
  NextFieldExtensionComponentProps,
} from './types';
import { Extension, attachComponentData } from '@backstage/core-plugin-api';
import { UIOptionsType } from '@rjsf/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FieldExtensionComponent } from '@backstage/plugin-scaffolder-react';
import { FIELD_EXTENSION_KEY } from '../../extensions/keys';

/**
 * Method for creating field extensions that can be used in the scaffolder
 * frontend form.
 * @alpha
 */
export function createNextScaffolderFieldExtension<
  TReturnValue = unknown,
  TInputProps extends UIOptionsType = {},
>(
  options: NextFieldExtensionOptions<TReturnValue, TInputProps>,
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

export type {
  NextCustomFieldValidator,
  NextFieldExtensionOptions,
  NextFieldExtensionComponentProps,
};
