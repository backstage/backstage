/*
 * Copyright 2024 The Backstage Authors
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
  ApiBlueprint,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { formFieldsApiRef } from './ref';
import { FormField, ScaffolderFormFieldsApi } from './types';
import { FormFieldBlueprint } from '../blueprints';
import { OpaqueFormField } from '@internal/scaffolder';

class DefaultScaffolderFormFieldsApi implements ScaffolderFormFieldsApi {
  private readonly formFieldLoaders: Array<() => Promise<FormField>>;

  constructor(formFieldLoaders: Array<() => Promise<FormField>> = []) {
    this.formFieldLoaders = formFieldLoaders;
  }

  async getFormFields() {
    const formFields = await Promise.all(
      this.formFieldLoaders.map(loader => loader()),
    );

    const internalFormFields = formFields.map(OpaqueFormField.toInternal);

    return internalFormFields;
  }
}

/** @alpha */
export const formFieldsApi = ApiBlueprint.makeWithOverrides({
  name: 'form-fields',
  inputs: {
    formFields: createExtensionInput([
      FormFieldBlueprint.dataRefs.formFieldLoader,
    ]),
  },
  factory(originalFactory, { inputs }) {
    const formFieldLoaders = inputs.formFields.map(e =>
      e.get(FormFieldBlueprint.dataRefs.formFieldLoader),
    );

    return originalFactory(defineParams =>
      defineParams({
        api: formFieldsApiRef,
        deps: {},
        factory: () => new DefaultScaffolderFormFieldsApi(formFieldLoaders),
      }),
    );
  },
});
