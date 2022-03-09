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
import { EntityPicker } from '../EntityPicker/EntityPicker';
import { FieldExtensionComponentProps } from '../../../extensions';

/**
 * The input props that can be specified under `ui:options` for the
 * `OwnerPicker` field extension.
 *
 * @public
 */
export interface OwnerPickerUiOptions {
  allowedKinds?: string[];
}

/**
 * The underlying component that is rendered in the form for the `OwnerPicker`
 * field extension.
 *
 * @public
 */
export const OwnerPicker = (
  props: FieldExtensionComponentProps<string, OwnerPickerUiOptions>,
) => {
  const {
    schema: { title = 'Owner', description = 'The owner of the component' },
    uiSchema,
    ...restProps
  } = props;

  const ownerUiSchema = {
    ...uiSchema,
    'ui:options': {
      allowedKinds: (uiSchema['ui:options']?.allowedKinds || [
        'Group',
        'User',
      ]) as string[],
      defaultKind: 'Group',
    },
  };

  return (
    <EntityPicker
      {...restProps}
      schema={{ title, description }}
      uiSchema={ownerUiSchema}
    />
  );
};
