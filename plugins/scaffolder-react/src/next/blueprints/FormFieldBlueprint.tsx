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
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { z } from 'zod';

import { OpaqueFormField, FormField } from '@internal/scaffolder';
import { FormFieldExtensionData } from './types';

const formFieldExtensionDataRef = createExtensionDataRef<
  () => Promise<FormField>
>().with({
  id: 'scaffolder.form-field-loader',
});

/**
 * @alpha
 * Creates extensions that are Field Extensions for the Scaffolder
 * */
export const FormFieldBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-form-field',
  attachTo: [
    { id: 'page:scaffolder', input: 'formFields' },
    { id: 'api:scaffolder/form-fields', input: 'formFields' },
  ],
  dataRefs: {
    formFieldLoader: formFieldExtensionDataRef,
  },
  output: [formFieldExtensionDataRef],
  *factory(params: { field: () => Promise<FormField> }) {
    yield formFieldExtensionDataRef(params.field);
  },
});

/**
 * @alpha
 * Used to create a form field binding with typechecking for compliance
 */
export function createFormField<
  TReturnValue extends z.ZodType,
  TUiOptions extends z.ZodType,
>(opts: FormFieldExtensionData<TReturnValue, TUiOptions>): FormField {
  return OpaqueFormField.createInstance('v1', opts);
}
