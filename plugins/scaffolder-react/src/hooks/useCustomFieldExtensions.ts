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
import { useAsync, useMountEffect } from '@react-hookz/web';
import { useApi, useElementFilter } from '@backstage/core-plugin-api';
import { formFieldsApiRef } from '../next';
import { FieldExtensionOptions } from '../extensions';
import {
  FIELD_EXTENSION_KEY,
  FIELD_EXTENSION_WRAPPER_KEY,
} from '../extensions/keys';

/**
 * Hook that returns all custom field extensions from the current outlet.
 * @public
 */
export const useCustomFieldExtensions = <
  // todo(blam): this shouldn't be here, should remove this, but this is a breaking change to remove the generic.
  TComponentDataType = FieldExtensionOptions,
>(
  outlet: React.ReactNode,
) => {
  // Get custom fields created with FormFieldBlueprint
  const formFieldsApi = useApi(formFieldsApiRef);
  const [{ result: blueprintFields }, { execute }] = useAsync(
    () => formFieldsApi.getFormFields(),
    [],
  );
  useMountEffect(execute);

  // Get custom fields created with ScaffolderFieldExtensions
  const outletFields = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: FIELD_EXTENSION_WRAPPER_KEY,
      })
      .findComponentData<TComponentDataType>({
        key: FIELD_EXTENSION_KEY,
      }),
  );

  // This should really be a different type moving foward, but we do this to keep type compatibility.
  // should probably also move the defaults into the API eventually too, but that will come with the move
  // to the new frontend system.
  const blueprintsToLegacy: FieldExtensionOptions[] = blueprintFields?.map(
    field => ({
      component: field.component,
      name: field.name,
      validation: field.validation,
      schema: field.schema?.schema,
    }),
  );

  return [...blueprintsToLegacy, ...outletFields] as TComponentDataType[];
};
