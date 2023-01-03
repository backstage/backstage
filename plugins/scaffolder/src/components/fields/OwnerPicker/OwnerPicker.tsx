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
import { OwnerPickerProps } from './schema';

export { OwnerPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `OwnerPicker`
 * field extension.
 *
 * @public
 */
export const OwnerPicker = (props: OwnerPickerProps) => {
  const {
    schema: { title = 'Owner', description = 'The owner of the component' },
    uiSchema,
    ...restProps
  } = props;

  const defaultNamespace = uiSchema['ui:options']?.defaultNamespace;
  const allowedKinds = uiSchema['ui:options']?.allowedKinds;

  const catalogFilter = uiSchema['ui:options']?.catalogFilter || {
    kind: allowedKinds || ['Group', 'User'],
  };

  const ownerUiSchema = {
    ...uiSchema,
    'ui:options': {
      catalogFilter,
      defaultKind: 'Group',
      allowArbitraryValues:
        uiSchema['ui:options']?.allowArbitraryValues ?? true,
      ...(defaultNamespace !== undefined ? { defaultNamespace } : {}),
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
