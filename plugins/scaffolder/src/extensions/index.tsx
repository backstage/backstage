/*
 * Copyright 2021 Spotify AB
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
import { JsonValue } from '@backstage/config';
import { Extension, useApi } from '@backstage/core';
import { FieldValidation, Field } from '@rjsf/core';
import { scaffolderApiRef } from '../api';

export type FieldExtensionOptions = {
  name: string;
  component: Field;
  validation: (data: JsonValue, field: FieldValidation) => void;
};

export function createScaffolderFieldExtension(
  options: FieldExtensionOptions,
): Extension<Field> {
  const WrappingRegister = () => {
    const scaffolderApi = useApi(scaffolderApiRef);
    scaffolderApi.registerCustomField(options);
    return null;
  };

  return {
    expose() {
      return WrappingRegister;
    },
  };
}
