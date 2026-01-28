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
  createApiRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { FormFieldBlueprint } from '@backstage/plugin-scaffolder-react/alpha';
import { OpaqueFormField } from '@internal/scaffolder';

interface FormField {
  readonly $$type: '@backstage/scaffolder/FormField';
}

interface ScaffolderFormFieldsApi {
  loadFormFields(): Promise<FormField[]>;
}

const formFieldsApiRef = createApiRef<ScaffolderFormFieldsApi>({
  id: 'plugin.scaffolder.form-fields-loader',
});

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
        factory: () => ({
          async loadFormFields() {
            const formFields = await Promise.all(
              formFieldLoaders.map(loader => loader()),
            );

            const internalFormFields = formFields.map(
              OpaqueFormField.toInternal,
            );

            return internalFormFields;
          },
        }),
      }),
    );
  },
});

export { formFieldsApiRef };
